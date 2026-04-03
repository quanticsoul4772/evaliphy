import { AsyncLocalStorage } from 'node:async_hooks';
import { EvaliphyConfig } from './types.js';

const G = globalThis as any;
G.__EVALIPHY_CONFIG_CONTEXT__ ??= new AsyncLocalStorage<EvaliphyConfig>();
G.__EVALIPHY_RESULT_CONTEXT__ ??= new AsyncLocalStorage<any>();

export const configContext: AsyncLocalStorage<EvaliphyConfig> = G.__EVALIPHY_CONFIG_CONTEXT__;
export const resultContext: AsyncLocalStorage<any> = G.__EVALIPHY_RESULT_CONTEXT__;

/**
 * Returns the current configuration from the execution context.
 */
export function getConfig(): EvaliphyConfig | undefined {
  return configContext.getStore();
}

/**
 * Runs a function within a configuration context.
 */
export function withConfig<T>(config: EvaliphyConfig, fn: () => T): T {
  return configContext.run(config, fn);
}

/**
 * Returns the current result from the execution context.
 */
export function getResult(): any | undefined {
  return resultContext.getStore();
}

/**
 * Runs a function within a result context.
 */
export function withResult<T>(result: any, fn: () => T): T {
  return resultContext.run(result, fn);
}
