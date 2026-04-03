import { describe, it, expect } from 'vitest';
import { mergeConfigs } from '../../src/config/mergeConfig.js';

describe('mergeConfigs Utility', () => {
    it('should correctly prioritize Project < File < CLI', () => {
        const projectConfig = { model: 'project', timeout: 5000, tags: ['a'] };
        const fileConfig = { model: 'file', tags: ['b'] };
        const cliConfig = { model: 'cli', timeout: 1000 };

        const merged = mergeConfigs(projectConfig, fileConfig, cliConfig);

        expect(merged.model).toBe('cli');
        expect(merged.timeout).toBe(1000);
        expect(merged.tags).toEqual(['b']); // File wins for tags because CLI has none
    });

    it('should correctly prioritize tags from CLI', () => {
        const projConfig = { tags: ['proj'] };
        const fileConfig = { tags: ['file'] };
        const cliConfig = { tags: ['cli'] };

        const merged = mergeConfigs(projConfig, fileConfig, cliConfig);
        expect(merged.tags).toEqual(['cli']);
    });

    it('should handle undefined tags', () => {
        const projConfig = { tags: ['proj'] };
        const fileConfig = {};
        const cliConfig = {};

        const merged = mergeConfigs(projConfig, fileConfig, cliConfig);
        expect(merged.tags).toEqual(['proj']);
    });

    it('should merge objects for non-tag fields by spread', () => {
        const c1 = { http: { baseUrl: 'A' } };
        const c2 = { http: { baseUrl: 'B', timeout: 100 } };
        
        const merged = mergeConfigs(c1 as any, c2 as any, {});
        // Since it's a spread in mergeConfigs implementation, it's not a deep merge
        // Wait, let's look at mergeConfig.ts implementation:
        // return { ...fileConfig, ...testConfig, ...cliConfig, tags: ... }
        // For 'http', it's NOT a deep merge in mergeConfigs.ts, but it IS in ConfigLoader.ts.
        expect(merged.http?.baseUrl).toBe('B');
        expect(merged.http?.timeout).toBe(100);
    });
});
