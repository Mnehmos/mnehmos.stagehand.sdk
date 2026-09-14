// Pure dependency-closure evaluation for Constitution Articles III and IX.
//
// Kept free of filesystem access so the guard itself is unit-testable: a boundary check that
// has never been observed rejecting a violating graph is not yet a control, just an intention.

/** Minimal glob match supporting a single trailing `*` or `/*` segment. */
export function matchesPattern(name, pattern) {
  if (pattern.endsWith('*')) {
    const prefix = pattern.slice(0, -1);
    return name.startsWith(prefix);
  }
  return name === pattern;
}

function forbiddenBucket(policy, name) {
  const buckets = policy.forbiddenExternalInCore ?? {};
  for (const [bucket, patterns] of Object.entries(buckets)) {
    for (const pattern of patterns) {
      if (matchesPattern(name, pattern)) return { bucket, pattern };
    }
  }
  return null;
}

const isInternal = (dep) => dep.startsWith('@stagehand/');

/**
 * @param {object} input
 * @param {Array<{dir:string,name:string,layer:string,internalDeps:string[],externalDeps:string[]}>} input.workspaces
 * @param {object} input.policy parsed docs/governance/boundaries.json
 * @returns {{errors:string[],warnings:string[]}}
 */
export function evaluateBoundaries({ workspaces, policy }) {
  const errors = [];
  const warnings = [];
  const byName = new Map(workspaces.map((w) => [w.name, w]));
  const byDir = new Map(workspaces.map((w) => [w.dir, w]));

  for (const ws of workspaces) {
    const layerPolicy = policy.layers?.[ws.layer];
    if (!layerPolicy) {
      errors.push(`${ws.dir}: unknown layer "${ws.layer}"`);
      continue;
    }

    for (const depName of ws.internalDeps ?? []) {
      const target = byName.get(depName);
      if (!target) {
        errors.push(`${ws.dir}: internal dependency "${depName}" does not resolve to a workspace`);
        continue;
      }
      if (!layerPolicy.mayDependOnLayers.includes(target.layer)) {
        errors.push(
          `${ws.dir} (layer ${ws.layer}) depends on ${target.dir} (layer ${target.layer}); ` +
          `layer ${ws.layer} may only depend on [${layerPolicy.mayDependOnLayers.join(', ')}]. ` +
          `${layerPolicy.rationale}`
        );
      }
    }

    if (ws.layer === 'core') {
      for (const depName of ws.externalDeps ?? []) {
        const hit = forbiddenBucket(policy, depName);
        if (hit) {
          errors.push(
            `${ws.dir} (layer core) declares external dependency "${depName}", which is a ` +
            `forbidden ${hit.bucket} implementation (Constitution Article III)`
          );
        }
      }
    }
  }

  // Self-edges are noise, not violations, but they mean the derivation is wrong.
  for (const ws of workspaces) {
    if ((ws.internalDeps ?? []).includes(ws.name)) {
      errors.push(`${ws.dir}: self-dependency; the dependency derivation is wrong`);
    }
  }

  // Cycles among workspaces.
  const state = new Map();
  const stack = [];
  const visit = (ws) => {
    const st = state.get(ws.name) ?? 'white';
    if (st === 'black') return;
    if (st === 'gray') {
      const at = stack.indexOf(ws.name);
      const cycle = [...stack.slice(at), ws.name].join(' -> ');
      errors.push(`dependency cycle: ${cycle}`);
      return;
    }
    state.set(ws.name, 'gray');
    stack.push(ws.name);
    for (const depName of ws.internalDeps ?? []) {
      const target = byName.get(depName) ?? byDir.get(depName);
      if (target) visit(target);
    }
    stack.pop();
    state.set(ws.name, 'black');
  };
  for (const ws of workspaces) visit(ws);

  // Something should actually be enforcing the rule, or the policy is decorative.
  const coreCount = workspaces.filter((w) => w.layer === 'core').length;
  if (coreCount === 0) warnings.push('no workspaces are declared in layer "core"; the headless-core rule is not being exercised');

  return { errors, warnings };
}
