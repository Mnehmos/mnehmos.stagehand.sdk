// These tests exercise the boundary guard itself, not the workspace tree.
//
// A policy that has only ever been observed passing is not a control. Each case below feeds
// tools/lib/boundaries-core.mjs a graph that must be rejected, so the gate is known to fail
// when Article III is violated.

import { describe, it, expect } from 'vitest';
import { evaluateBoundaries, matchesPattern } from '../tools/lib/boundaries-core.mjs';

const policy = {
  layers: {
    core: { mayDependOnLayers: ['core'], rationale: 'core is headless' },
    compatibility: { mayDependOnLayers: ['core', 'compatibility'], rationale: 'compat adapts dialects' },
    plugin: { mayDependOnLayers: ['core', 'compatibility', 'plugin'], rationale: 'plugins own domains' },
    example: { mayDependOnLayers: ['core', 'compatibility', 'plugin', 'example'], rationale: 'hosts compose' },
  },
  forbiddenExternalInCore: {
    renderers: ['three', '@react-three/*'],
    maps: ['maplibre-gl', '@deck.gl/*'],
    modelProviders: ['openai', '@anthropic-ai/*'],
    speech: ['elevenlabs'],
    chess: ['chess.js'],
  },
};

const ws = (dir, name, layer, internalDeps = [], externalDeps = []) => ({ dir, name, layer, internalDeps, externalDeps });

const graph = [
  ws('packages/runtime', '@stagehand/runtime', 'core'),
  ws('plugins/geo-clio', '@stagehand/plugin-geo-clio', 'plugin', ['@stagehand/runtime']),
  ws('examples/host', '@stagehand/example-host', 'example', ['@stagehand/plugin-geo-clio']),
];

describe('matchesPattern', () => {
  it('matches exact names and trailing-star prefixes only', () => {
    expect(matchesPattern('three', 'three')).toBe(true);
    expect(matchesPattern('three-mesh-bvh', 'three')).toBe(false);
    expect(matchesPattern('@react-three/fiber', '@react-three/*')).toBe(true);
    expect(matchesPattern('@deck.gl/core', '@deck.gl/*')).toBe(true);
    expect(matchesPattern('@deck.glx/core', '@deck.gl/*')).toBe(false);
    expect(matchesPattern('openai', 'openai')).toBe(true);
  });
});

describe('evaluateBoundaries', () => {
  it('accepts a correctly layered graph', () => {
    const { errors } = evaluateBoundaries({ workspaces: graph, policy });
    expect(errors).toEqual([]);
  });

  it('rejects a core package that depends on a plugin', () => {
    const violating = [
      ws('packages/runtime', '@stagehand/runtime', 'core', ['@stagehand/plugin-geo-clio']),
      ws('plugins/geo-clio', '@stagehand/plugin-geo-clio', 'plugin'),
    ];
    const { errors } = evaluateBoundaries({ workspaces: violating, policy });
    expect(errors.some((e) => e.includes('layer core') && e.includes('layer plugin'))).toBe(true);
  });

  it('rejects a renderer or map dependency inside core', () => {
    const violating = [ws('packages/runtime', '@stagehand/runtime', 'core', [], ['three', 'maplibre-gl'])];
    const { errors } = evaluateBoundaries({ workspaces: violating, policy });
    expect(errors.filter((e) => e.includes('forbidden')).length).toBe(2);
  });

  it('rejects a model-provider dependency inside core', () => {
    const violating = [ws('packages/trace', '@stagehand/trace', 'core', [], ['openai'])];
    const { errors } = evaluateBoundaries({ workspaces: violating, policy });
    expect(errors.some((e) => e.includes('modelProviders'))).toBe(true);
  });

  it('allows renderer and provider dependencies outside core', () => {
    const ok = [
      ws('packages/runtime', '@stagehand/runtime', 'core'),
      ws('plugins/geo-clio', '@stagehand/plugin-geo-clio', 'plugin', ['@stagehand/runtime'], ['three', 'maplibre-gl']),
      ws('examples/host', '@stagehand/example-host', 'example', [], ['openai', 'elevenlabs']),
    ];
    const { errors } = evaluateBoundaries({ workspaces: ok, policy });
    expect(errors).toEqual([]);
  });

  it('rejects a dependency on an example host', () => {
    const violating = [
      ws('examples/host', '@stagehand/example-host', 'example'),
      ws('plugins/geo-clio', '@stagehand/plugin-geo-clio', 'plugin', ['@stagehand/example-host']),
    ];
    const { errors } = evaluateBoundaries({ workspaces: violating, policy });
    expect(errors.some((e) => e.includes('layer example'))).toBe(true);
  });

  it('rejects an unresolvable internal dependency', () => {
    const violating = [ws('packages/runtime', '@stagehand/runtime', 'core', ['@stagehand/nope'])];
    const { errors } = evaluateBoundaries({ workspaces: violating, policy });
    expect(errors.some((e) => e.includes('does not resolve'))).toBe(true);
  });

  it('detects dependency cycles', () => {
    const cyclic = [
      ws('packages/a', '@stagehand/a', 'core', ['@stagehand/b']),
      ws('packages/b', '@stagehand/b', 'core', ['@stagehand/a']),
    ];
    const { errors } = evaluateBoundaries({ workspaces: cyclic, policy });
    expect(errors.some((e) => e.includes('dependency cycle'))).toBe(true);
  });

  it('rejects an unknown layer', () => {
    const violating = [ws('packages/x', '@stagehand/x', 'mystery')];
    const { errors } = evaluateBoundaries({ workspaces: violating, policy });
    expect(errors.some((e) => e.includes('unknown layer'))).toBe(true);
  });

  it('rejects a self-dependency', () => {
    const violating = [ws('packages/a', '@stagehand/a', 'core', ['@stagehand/a'])];
    const { errors } = evaluateBoundaries({ workspaces: violating, policy });
    expect(errors.some((e) => e.includes('self-dependency'))).toBe(true);
  });
});
