import { EvaliphyConfig } from './types.js';

/**
 * Merges multiple configurations with the following priority (highest to lowest):
 * 1. CLI flags
 * 2. Test file config (use)
 * 3. File config (evaliphy.config.ts)
 */
export function mergeConfigs(
  fileConfig: EvaliphyConfig = {},
  testConfig: EvaliphyConfig = {},
  cliConfig: EvaliphyConfig = {}
): EvaliphyConfig {
  const merged: EvaliphyConfig = {
    ...fileConfig,
    ...testConfig,
    ...cliConfig,
  };

  // Deep merge 'http' object
  const mergedHttp = {
    ...(fileConfig.http || {}),
    ...(testConfig.http || {}),
    ...(cliConfig.http || {}),
  } as any;

  // Deep merge 'http.headers' record
  if (fileConfig.http?.headers || testConfig.http?.headers || cliConfig.http?.headers) {
    mergedHttp.headers = {
      ...(fileConfig.http?.headers || {}),
      ...(testConfig.http?.headers || {}),
      ...(cliConfig.http?.headers || {}),
    };
  }

  if (Object.keys(mergedHttp).length > 0) {
    merged.http = mergedHttp;
  }

  // Deep merge 'llmAsJudgeConfig' object
  const mergedLLMJudge = {
    ...(fileConfig.llmAsJudgeConfig || {}),
    ...(testConfig.llmAsJudgeConfig || {}),
    ...(cliConfig.llmAsJudgeConfig || {}),
  } as any;

  // Deep merge 'llmAsJudgeConfig.provider'
  if (fileConfig.llmAsJudgeConfig?.provider || testConfig.llmAsJudgeConfig?.provider || cliConfig.llmAsJudgeConfig?.provider) {
    mergedLLMJudge.provider = {
      ...(fileConfig.llmAsJudgeConfig?.provider || {}),
      ...(testConfig.llmAsJudgeConfig?.provider || {}),
      ...(cliConfig.llmAsJudgeConfig?.provider || {}),
    };
  }

  if (Object.keys(mergedLLMJudge).length > 0) {
    merged.llmAsJudgeConfig = mergedLLMJudge;
  }

  return merged;
}
