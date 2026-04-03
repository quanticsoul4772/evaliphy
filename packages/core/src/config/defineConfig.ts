import { EvaliphyConfig } from "./types.js";

/**
 * Utility function to define Evaliphy configuration with IDE support.
 *
 * @param config - The evaluation configuration object.
 * @returns The same config object, but with type safety.
 *
 * @example
 * export default defineConfig({
 *   http: { baseUrl: 'https://api.my-rag-app.com' },
 *   testDir: './tests/eval'
 * });
 */
export function defineConfig(config: EvaliphyConfig): EvaliphyConfig {
  return config;
}
