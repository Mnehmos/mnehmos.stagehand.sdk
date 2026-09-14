/**
 * Value type checking (FR-175, FR-177).
 *
 * Every function here **checks and never converts**. A validator that coerces `speed=TELEPORT` into
 * a valid member, or rounds `1.5` into an integer, has silently repaired producer output, which
 * DIV-004 forbids. A value either satisfies its declared type or it is rejected with a reason.
 *
 * Values arrive as strings because that is what the wire format carries; `number`, `boolean`, and
 * `duration` therefore have a defined textual grammar, stated here rather than left implicit.
 */

import type { ValueType } from './types.js';

export interface ValueCheck {
  readonly ok: boolean;
  readonly reason?: string;
}

const OK: ValueCheck = { ok: true };
const fail = (reason: string): ValueCheck => ({ ok: false, reason });

const ENTITY_REF = /^[a-z][a-z0-9_-]*(?::[^\s:]+)?$/i;
const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const FN_COLOR = /^rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*(?:,\s*[\d.]+\s*)?\)$/i;
const DURATION = /^([+-]?(?:\d+\.?\d*|\.\d+))\s*(ms|s|m)?$/i;

const DURATION_UNIT_MS: Record<string, number> = { ms: 1, s: 1000, m: 60_000 };

/** Parse a number under this project's grammar. Rejects empty, `NaN`, `Infinity`, and `1_000`. */
export function parseNumber(input: string): number | undefined {
  const trimmed = input.trim();
  if (trimmed === '') return undefined;
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(trimmed)) return undefined;
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : undefined;
}

/** Parse a duration into milliseconds. Bare numbers are milliseconds: `250`, `1.5s`, `2m`. */
export function parseDurationMs(input: string): number | undefined {
  const match = DURATION.exec(input.trim());
  if (match === null) return undefined;
  const magnitude = Number(match[1]);
  if (!Number.isFinite(magnitude)) return undefined;
  const unit = (match[2] ?? 'ms').toLowerCase();
  const factor = DURATION_UNIT_MS[unit];
  if (factor === undefined) return undefined;
  return magnitude * factor;
}

/**
 * Booleans are exactly the JSON literals `true` and `false`.
 *
 * Not case-folded and not trimmed. The projected JSON Schema declares `{"type":"boolean"}`, whose
 * only literals are lowercase — accepting `TRUE` would make the introspected contract and the
 * enforced contract disagree about the same value, which is the drift class this feature exists to
 * remove. A producer that sends `TRUE` is corrected, not accommodated.
 */
function checkBoolean(value: string): ValueCheck {
  if (value === 'true' || value === 'false') return OK;
  return fail(`expected a boolean (true/false), got "${value}"`);
}

function checkNumber(value: string, type: Extract<ValueType, { kind: 'number' }>): ValueCheck {
  const parsed = parseNumber(value);
  if (parsed === undefined) return fail(`expected a number, got "${value}"`);
  if (type.integer === true && !Number.isInteger(parsed)) {
    return fail(`expected an integer, got "${value}"`);
  }
  if (type.min !== undefined && parsed < type.min) {
    return fail(`expected a number >= ${type.min}, got "${value}"`);
  }
  if (type.max !== undefined && parsed > type.max) {
    return fail(`expected a number <= ${type.max}, got "${value}"`);
  }
  return OK;
}

function checkDuration(value: string, type: Extract<ValueType, { kind: 'duration' }>): ValueCheck {
  const ms = parseDurationMs(value);
  if (ms === undefined) return fail(`expected a duration (e.g. 250, 250ms, 1.5s), got "${value}"`);
  if (type.minMs !== undefined && ms < type.minMs) {
    return fail(`expected a duration >= ${type.minMs}ms, got "${value}"`);
  }
  if (type.maxMs !== undefined && ms > type.maxMs) {
    return fail(`expected a duration <= ${type.maxMs}ms, got "${value}"`);
  }
  return OK;
}

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item !== '');
}

function checkListLength(items: readonly string[], min?: number, max?: number): ValueCheck {
  if (min !== undefined && items.length < min) {
    return fail(`expected at least ${min} item(s), got ${items.length}`);
  }
  if (max !== undefined && items.length > max) {
    return fail(`expected at most ${max} item(s), got ${items.length}`);
  }
  return OK;
}

/**
 * Check a supplied value against its declared type.
 *
 * @returns `{ ok: true }` or `{ ok: false, reason }` with a message naming what was expected.
 */
export function checkValue(value: string, type: ValueType): ValueCheck {
  switch (type.kind) {
    case 'string': {
      if (type.minLength !== undefined && value.length < type.minLength) {
        return fail(`expected at least ${type.minLength} character(s)`);
      }
      if (type.maxLength !== undefined && value.length > type.maxLength) {
        return fail(`expected at most ${type.maxLength} character(s)`);
      }
      return OK;
    }
    case 'enum': {
      const caseSensitive = type.caseSensitive ?? false;
      const haystack = caseSensitive ? type.values : type.values.map((v) => v.toLowerCase());
      const needle = caseSensitive ? value : value.toLowerCase();
      if (haystack.includes(needle)) return OK;
      return fail(`expected one of [${type.values.join(', ')}], got "${value}"`);
    }
    case 'number':
      return checkNumber(value, type);
    case 'boolean':
      return checkBoolean(value);
    case 'duration':
      return checkDuration(value, type);
    case 'color': {
      const trimmed = value.trim();
      if (HEX_COLOR.test(trimmed) || FN_COLOR.test(trimmed)) return OK;
      // A schema may declare named colours; the host palette is not core's vocabulary, so an
      // undeclared name is rejected rather than accepted as a CSS name this package does not know.
      if (type.named !== undefined && type.named.includes(trimmed)) return OK;
      const expected =
        type.named === undefined || type.named.length === 0
          ? 'a hex or rgb() color'
          : `a hex color or one of [${type.named.join(', ')}]`;
      return fail(`expected ${expected}, got "${value}"`);
    }
    case 'entityRef': {
      if (ENTITY_REF.test(value.trim())) return OK;
      return fail(`expected an entity reference (e.g. country:iran), got "${value}"`);
    }
    case 'entityRefList': {
      const items = splitList(value);
      const length = checkListLength(items, type.minItems, type.maxItems);
      if (!length.ok) return length;
      for (const item of items) {
        if (!ENTITY_REF.test(item)) return fail(`expected an entity reference, got "${item}"`);
      }
      return OK;
    }
    case 'stringList':
      return checkListLength(splitList(value), type.minItems, type.maxItems);
  }
}

/** Human-readable type name, used in introspection and error messages. */
export function describeValueType(type: ValueType): string {
  switch (type.kind) {
    case 'string':
      return 'string';
    case 'enum':
      return `enum(${type.values.join('|')})`;
    case 'number': {
      const bounds: string[] = [];
      if (type.min !== undefined) bounds.push(`>=${type.min}`);
      if (type.max !== undefined) bounds.push(`<=${type.max}`);
      const base = type.integer === true ? 'integer' : 'number';
      return bounds.length > 0 ? `${base}(${bounds.join(',')})` : base;
    }
    case 'boolean':
      return 'boolean';
    case 'duration':
      return 'duration';
    case 'color':
      return type.named === undefined || type.named.length === 0
        ? 'color'
        : `color(${type.named.join('|')}|#hex)`;
    case 'entityRef':
      return 'entityRef';
    case 'entityRefList':
      return 'entityRefList';
    case 'stringList':
      return 'stringList';
  }
}
