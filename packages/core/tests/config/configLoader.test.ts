import * as fs from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfigLoader } from '../../src/config/configLoader.js';
import { mergeConfigs } from '../../src/config/mergeConfig.js';
import { EvaliphyConfigSchema } from '../../src/config/schema.js';

// Mock fs
vi.mock('node:fs');

describe('ConfigLoader', () => {
    beforeEach(() => {
        ConfigLoader.resetInstance();
        vi.clearAllMocks();
    });

    it('should be a singleton', () => {
        const instance1 = ConfigLoader.getInstance();
        const instance2 = ConfigLoader.getInstance();
        expect(instance1).toBe(instance2);
    });

    it('should allow initializing with CLI overrides', () => {
        const cliOverrides = { model: 'gpt-4' };
        const instance = ConfigLoader.initialize(cliOverrides);

        // Use any to access private members for testing state
        expect((instance as any).cliOverrides).toEqual(cliOverrides);
    });

    it('should clear cache and reset state with resetInstance', () => {
        ConfigLoader.initialize({ model: 'gpt-4' });

        ConfigLoader.resetInstance();
        const newInstance = ConfigLoader.getInstance();
        expect((newInstance as any).cliOverrides).toEqual({});
    });

    describe('mergeConfigs', () => {
        it('should correctly prioritize Project < File < CLI', () => {
            const projectConfig = {
                model: 'project',
                timeout: 5000,
                http: { baseUrl: 'A', headers: { 'X-1': '1' } }
            };
            const fileConfig = {
                model: 'file',
                http: { baseUrl: 'B', headers: { 'X-2': '2' } }
            };
            const cliConfig = {
                timeout: 1000,
                http: { baseUrl: 'C', headers: { 'X-1': 'overridden' } }
            };

            const merged = mergeConfigs(projectConfig, fileConfig, cliConfig);

            // Priorities
            expect(merged.model).toBe('file'); // CLI didn't override, File wins over Project
            expect(merged.timeout).toBe(1000); // CLI wins

            // Deep merge http
            expect(merged.http?.baseUrl).toBe('C'); // CLI wins

            // Headers should be merged
            expect(merged.http?.headers).toEqual({
                'X-1': 'overridden',
                'X-2': '2'
            });
        });

        it('should correctly deep merge llmAsJudgeConfig', () => {
            const fileConfig = {
                llmAsJudgeConfig: {
                    model: 'gpt-4o-mini',
                    provider: { type: 'openai' },
                    temperature: 0.1
                }
            };
            const testConfig = {
                llmAsJudgeConfig: {
                    model: 'gpt-4o',
                    maxTokens: 500
                }
            };
            const cliConfig = {
                llmAsJudgeConfig: {
                    temperature: 0.7
                }
            };

            const merged = mergeConfigs(fileConfig as any, testConfig as any, cliConfig as any);

            expect(merged.llmAsJudgeConfig?.model).toBe('gpt-4o'); // testConfig wins over fileConfig
            expect((merged.llmAsJudgeConfig?.provider as any).type).toBe('openai'); // fileConfig preserved
            expect(merged.llmAsJudgeConfig?.temperature).toBe(0.7); // cliConfig wins
            expect(merged.llmAsJudgeConfig?.maxTokens).toBe(500); // testConfig preserved
        });

        it('should handle missing configs during merge', () => {
            const merged = mergeConfigs({ model: 'project' } as any, {}, {});
            expect(merged.model).toBe('project');
        });
    });

    // Note: load() is harder to unit test without complex dynamic import mocking
    // but we can at least test findConfigFile logic if we spy on existence
    it('should use custom configFile path from CLI if provided', () => {
        ConfigLoader.initialize({ configFile: 'custom.config.ts' });
        const instance = ConfigLoader.getInstance();

        const existsSpy = vi.spyOn(fs, 'existsSync').mockReturnValue(true);

        const path = (instance as any).findConfigFile('/root');
        expect(path).toContain('custom.config.ts');
        expect(existsSpy).toHaveBeenCalled();
    });

    it('should search for default config files if no custom path given', () => {
        const instance = ConfigLoader.getInstance();
        const existsSpy = vi.spyOn(fs, 'existsSync').mockImplementation((p) => String(p).endsWith('evaliphy.config.mjs'));

        const path = (instance as any).findConfigFile('/root');
        expect(path).toContain('evaliphy.config.mjs');
        expect(existsSpy).toHaveBeenCalled();
    });

    it('should return null if no config file found', () => {
        const instance = ConfigLoader.getInstance();
        vi.spyOn(fs, 'existsSync').mockReturnValue(false);

        const path = (instance as any).findConfigFile('/root');
        expect(path).toBeNull();
    });

    describe('EvaliphyConfigSchema', () => {
        it('should validate valid llmAsJudgeConfig', () => {
            const config = {
                llmAsJudgeConfig: {
                    model: 'gpt-4o',
                    provider: { type: 'openai' }
                }
            };
            const result = EvaliphyConfigSchema.safeParse(config);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.llmAsJudgeConfig?.temperature).toBe(0);
                expect(result.data.llmAsJudgeConfig?.maxTokens).toBe(1000);
            }
        });

        it('should validate gateway provider', () => {
            const config = {
                llmAsJudgeConfig: {
                    model: 'gpt-4o',
                    provider: {
                        type: 'gateway',
                        url: 'https://api.openai.com/v1',
                        name: 'local-gateway'
                    }
                }
            };
            const result = EvaliphyConfigSchema.safeParse(config);
            expect(result.success).toBe(true);
        });

        it('should reject invalid provider type', () => {
            const config = {
                llmAsJudgeConfig: {
                    model: 'gpt-4o',
                    provider: { type: 'invalid' }
                }
            };
            const result = EvaliphyConfigSchema.safeParse(config);
            expect(result.success).toBe(false);
        });

        it('should reject missing provider', () => {
            const config = {
                llmAsJudgeConfig: {
                    model: 'gpt-4o'
                }
            };
            const result = EvaliphyConfigSchema.safeParse(config);
            expect(result.success).toBe(false);
        });
    });
});
