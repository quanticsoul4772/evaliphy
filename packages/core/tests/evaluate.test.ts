import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createEvaluate } from '../src/evaluate.js';
import * as registry from '../src/collection/registry.js';
import { EvaliphyErrorCode } from '../src/error/errors.js';

vi.mock('../src/collection/registry.js', () => ({
    registerEval: vi.fn(),
    registerHook: vi.fn(),
    registerFileConfig: vi.fn()
}));

describe('Evaluate SDK', () => {
    let evaluate: any;

    beforeEach(() => {
        vi.clearAllMocks();
        evaluate = createEvaluate();
    });

    it('should register a test case when called as evaluate(name, fn)', () => {
        const fn = async () => {};
        evaluate('test name', fn);
        
        expect(registry.registerEval).toHaveBeenCalledWith({
            kind: 'test',
            name: 'test name',
            fn
        });
    });

    it('should register a beforeEach hook', () => {
        const hookFn = () => {};
        evaluate.beforeEach(hookFn);
        
        expect(registry.registerHook).toHaveBeenCalledWith('beforeEach', hookFn);
    });

    it('should register an afterEach hook', () => {
        const hookFn = () => {};
        evaluate.afterEach(hookFn);
        
        expect(registry.registerHook).toHaveBeenCalledWith('afterEach', hookFn);
    });

    describe('evaluate.use()', () => {
        it('should register file config for valid config', () => {
            const config = { timeout: 1000, model: 'gpt-4' };
            evaluate.use(config);
            
            expect(registry.registerFileConfig).toHaveBeenCalledWith(config);
        });

        it('should throw EvaliphyError for invalid config', () => {
            const invalidConfig = { timeout: 'not a number' };
            
            expect(() => evaluate.use(invalidConfig as any)).toThrow();
            try {
                evaluate.use(invalidConfig as any);
            } catch (err: any) {
                expect(err.code).toBe(EvaliphyErrorCode.INVALID_CONFIG);
            }
        });

        it('should support deep merge in type definition (though registry does Object.assign)', () => {
            const config = { http: { baseUrl: 'https://test.com' } };
            evaluate.use(config);
            expect(registry.registerFileConfig).toHaveBeenCalledWith(config);
        });
    });
});
