import { describe, it, expect, beforeEach } from 'vitest';
import { 
    registerEval, 
    registerHook, 
    registerFileConfig, 
    getRegistry, 
    getHooks, 
    getFileConfig, 
    clearRegistry 
} from '../../src/collection/registry.js';
import { EvaliphyErrorCode } from '../../src/error/errors.js';

describe('Registry', () => {
    beforeEach(() => {
        clearRegistry();
    });

    it('should register an evaluation test case', () => {
        const testCase: any = { name: 'Test 1', fn: () => {} };
        registerEval(testCase);
        
        const registry = getRegistry();
        expect(registry).toHaveLength(1);
        expect(registry[0]).toEqual(testCase);
    });

    it('should throw error if test case has no name', () => {
        const testCase: any = { name: '', fn: () => {} };
        
        expect(() => registerEval(testCase)).toThrow();
        try {
            registerEval(testCase);
        } catch (err: any) {
            expect(err.code).toBe(EvaliphyErrorCode.INVALID_EVAL_NAME);
        }
    });

    it('should register hooks', () => {
        const hookFn = () => {};
        registerHook('beforeEach', hookFn as any);
        registerHook('afterEach', hookFn as any);
        
        expect(getHooks('beforeEach')).toContain(hookFn);
        expect(getHooks('afterEach')).toContain(hookFn);
    });

    it('should register and merge file configuration', () => {
        registerFileConfig({ model: 'gpt-4' });
        expect(getFileConfig().model).toBe('gpt-4');
        
        registerFileConfig({ timeout: 1000 });
        expect(getFileConfig().model).toBe('gpt-4');
        expect(getFileConfig().timeout).toBe(1000);
    });

    it('should clear all registry data', () => {
        registerEval({ name: 'Test', fn: () => {} } as any);
        registerHook('beforeEach', (() => {}) as any);
        registerFileConfig({ model: 'gpt-4' });
        
        clearRegistry();
        
        expect(getRegistry()).toHaveLength(0);
        expect(getHooks('beforeEach')).toHaveLength(0);
        expect(getFileConfig()).toEqual({});
    });
});
