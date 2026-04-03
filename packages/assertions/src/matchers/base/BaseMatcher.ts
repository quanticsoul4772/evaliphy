import type { EvalInput } from '../../engine/types.js';

export abstract class BaseMatcher {
  abstract name: string;
  abstract usesLLM: boolean;

  abstract validate(input: EvalInput): void;
}
