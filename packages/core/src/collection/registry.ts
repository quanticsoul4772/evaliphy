import { EvaliphyConfig } from "../config/types.js";
import { EvaliphyError, EvaliphyErrorCode } from "../error/errors.js";
import { Awaitable, EvalTest, EvaluationFixtures } from './types.js';

export type HookType = 'beforeEach' | 'afterEach';

export interface Hook {
  type: HookType;
  fn: (fixtures: EvaluationFixtures) => Awaitable<void>;
}

const G = globalThis as any;

// Initialize globals safely (idempotent)
G.__EVALIPHY_REGISTRY__ ??= [];
G.__EVALIPHY_HOOKS__ ??= [];
G.__EVALIPHY_FILE_CONFIG__ ??= {};

const registry: EvalTest[] = G.__EVALIPHY_REGISTRY__;
const hooks: Hook[] = G.__EVALIPHY_HOOKS__;
const fileConfig: Partial<EvaliphyConfig> = G.__EVALIPHY_FILE_CONFIG__;


// --- Utils ---
function isObject(value: any): value is Record<string, any> {
  return value && typeof value === 'object' && !Array.isArray(value);
}

// Simple deep merge (avoids lodash dependency)
function deepMerge(target: any, source: any) {
  for (const key of Object.keys(source)) {
    const sourceVal = source[key];
    const targetVal = target[key];

    if (isObject(sourceVal) && isObject(targetVal)) {
      deepMerge(targetVal, sourceVal);
    } else {
      target[key] = sourceVal;
    }
  }
}


// --- Registry APIs ---
export function registerEval(evalCase: EvalTest) {
  if (!evalCase.name || evalCase.name.trim() === '') {
    throw new EvaliphyError(
      EvaliphyErrorCode.INVALID_EVAL_NAME,
      'Each evaluation should have a name.',
      "Example: evaluate(\"some name\", async () => {...})",
      "Failing because test does not have a name"
    );
  }

  registry.push(evalCase);
}

export function registerHook(type: HookType, fn: Hook['fn']) {
  hooks.push({ type, fn });
}


// --- Config APIs ---
export function registerFileConfig(config: Partial<EvaliphyConfig>) {
  if (!config || typeof config !== 'object') return;

  deepMerge(fileConfig, config);
}

export function getFileConfig(): Partial<EvaliphyConfig> {
  // Return shallow copy to prevent accidental mutation
  return { ...fileConfig };
}


// --- Accessors ---
export function getRegistry(): EvalTest[] {
  return [...registry]; // defensive copy
}

export function getHooks(type: HookType): Hook['fn'][] {
  return hooks
    .filter(h => h.type === type)
    .map(h => h.fn);
}


// --- Reset (mainly for tests) ---
export function clearRegistry() {
  registry.length = 0;
  hooks.length = 0;

  // Preserve reference but clear content
  for (const key of Object.keys(fileConfig)) {
    delete (fileConfig as any)[key];
  }
}
