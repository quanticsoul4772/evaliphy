import { Awaitable, EvalTest, EvaluationFixtures } from './collection/types.js'
import { registerEval, registerHook, registerFileConfig } from './collection/registry.js'
import { EvaliphyConfig } from './config/types.js'
import { EvaliphyConfigSchema } from './config/schema.js'
import { EvaliphyError, EvaliphyErrorCode } from './error/errors.js'

/**
 * The high-level function for defining RAG evaluations.
 */
export interface Evaluate {
    /**
     * Defines a new evaluation test case for a RAG application.
     */
    (name: string, fn: (fixtures: EvaluationFixtures) => Awaitable<void>): void;

    /**
     * Override specific configuration for all tests in the current file.
     *
     * @param config - A partial configuration object.
     *
     * @example
     * evaluate.use({
     *   timeout: 5000,
     *   model: 'gpt-4o'
     * })
     */
    use(config: Partial<EvaliphyConfig>): void;

    /**
     * Registers a hook to run before every test case in the current evaluation file.
     */
    beforeEach(fn: (fixtures: EvaluationFixtures) => Awaitable<void>): void;

    /**
     * Registers a hook to run after every test case in the current evaluation file.
     */
    afterEach(fn: (fixtures: EvaluationFixtures) => Awaitable<void>): void;
}

/**
 * Creates the global evaluation function with auxiliary methods.
 */
export function createEvaluate(): Evaluate {

    const evaluate = function (
        name: string,
        fn: (fixtures: EvaluationFixtures) => Awaitable<void>
    ) {
        const testNode: EvalTest = { kind: 'test', name, fn }
        registerEval(testNode)
    } as Evaluate

    evaluate.use = function (config: Partial<EvaliphyConfig>) {
        const result = EvaliphyConfigSchema.partial().safeParse(config)
        if (!result.success) {
            throw new EvaliphyError(
                EvaliphyErrorCode.INVALID_CONFIG,
                'Invalid configuration passed to evaluate.use()',
                result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n'),
                result.error
            )
        }
        registerFileConfig(config)
    }

    evaluate.beforeEach = function (fn: (fixtures: EvaluationFixtures) => Awaitable<void>) {
        registerHook('beforeEach', fn)
    }

    evaluate.afterEach = function (fn: (fixtures: EvaluationFixtures) => Awaitable<void>) {
        registerHook('afterEach', fn)
    }

    return evaluate
}

/**
 * Defines a new evaluation test case for a RAG application.
 *
 * @param name - The descriptive name of the test case.
 * @param fn - An asynchronous function that performs the evaluation. Receives fixtures.csv as its first argument.
 *
 * @example
 * evaluate('Simple Greetings', async ({ httpClient }) => {
 *   const res = await httpClient.post('/chat', { input: 'Hi!' });
 *   // perform assertions here
 * });
 *
 */
export const evaluate = createEvaluate()
