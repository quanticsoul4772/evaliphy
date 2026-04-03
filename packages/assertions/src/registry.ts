import { z } from 'zod';
import { toBeCoherentDefinition } from './matchers/core/toBeCoherent.js';
import { toBeFaithfulDefinition } from './matchers/core/toBeFaithful.js';
import { toBeGroundedDefinition } from './matchers/core/toBeGrounded.js';
import { toBeHarmlessDefinition } from './matchers/core/toBeHarmless.js';
import { toBeRelevantDefinition } from './matchers/core/toBeRelevant.js';


export interface SchemaField {
  name: string;
  type: 'string' | 'number' | 'boolean';
  description: string;
}

export interface OutputSchema {
  fields: SchemaField[];
  example: Record<string, unknown>;
  zodSchema: z.ZodObject<any>;
}

export interface AssertionDefinition {
  name: string;
  inputVariables: string[]; // what the prompt template must use
  outputSchema: OutputSchema; // what the LLM must return — SDK owned
}


export const assertionRegistry: Record<string, AssertionDefinition> = {
  toBeFaithful: toBeFaithfulDefinition,
  toBeRelevant: toBeRelevantDefinition,
  toBeGrounded: toBeGroundedDefinition,
  toBeCoherent: toBeCoherentDefinition,
  toBeHarmless: toBeHarmlessDefinition,
};
