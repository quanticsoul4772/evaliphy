import { z } from 'zod';

export const HttpConfigSchema = z.object({
  baseUrl: z.string(),
  timeout: z.number().default(120000),
  retry: z.object({
    attempts: z.number(),
    delay: z.number(),
  }).optional(),
  headers: z.record(z.string(), z.string()).optional(),
});

export const DirectProviderSchema = z.object({
  type: z.enum(['openai', 'anthropic', 'google', 'mistral', 'groq', 'cohere']),
  apiKey: z.string().optional(),
});

export const GatewayProviderSchema = z.object({
  type: z.literal('gateway'),
  url: z.string(),
  apiKey: z.string().optional(),
  name: z.string().optional(),
});

export const LLMProviderSchema = z.union([
  DirectProviderSchema,
  GatewayProviderSchema,
]);

export const LLMJudgeConfigSchema = z.object({
  model: z.string(),
  provider: LLMProviderSchema,
  temperature: z.number().optional().default(0),
  maxTokens: z.number().optional().default(1000),
  timeout: z.number().optional(),
});


export const EvaliphyConfigSchema = z.object({
  http: HttpConfigSchema.optional(),
  llmAsJudgeConfig: LLMJudgeConfigSchema.optional(),
  configFile: z.string().optional(),
  timeout: z.number().optional(),
  reporters: z.union([z.string(), z.array(z.union([z.string(), z.any()]))]).optional().default(['console']),

  // discovery
  evalDir: z.string().default('./evals'),
  testMatch: z.array(z.string()).default(['**/*.eval.ts', '**/*.eval.js']),
  testIgnore: z.array(z.string()).default(['**/node_modules/**']),
});
