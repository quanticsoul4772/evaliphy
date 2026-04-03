import { describe, expect, it } from 'vitest';
import { PromptRenderer } from '../../src/promptManager/promptRenderer.js';
import { assertionRegistry } from '../../src/registry.js';

describe('PromptRenderer', () => {
  const mockAssertion = assertionRegistry.toBeFaithful;

  it('should fill variables and append output block', () => {
    const template = 'Question: {{question}}\nContext: {{context}}\nResponse: {{response}}';
    const variables = {
      question: 'What is Evaliphy?',
      context: 'Evaliphy is a RAG evaluation SDK.',
      response: 'It is an SDK for RAG.'
    };

    const result = PromptRenderer.render(template, variables, mockAssertion);

    expect(result).toContain('Question: What is Evaliphy?');
    expect(result).toContain('Context: Evaliphy is a RAG evaluation SDK.');
    expect(result).toContain('Response: It is an SDK for RAG.');
    expect(result).toContain('## Required Output Format');
    expect(result).toContain('"score": 0.9');
  });

  it('should handle missing variables gracefully by leaving placeholders', () => {
    const template = 'Question: {{question}}';
    const variables = {};

    const result = PromptRenderer.render(template, variables as any, mockAssertion);
    expect(result).toContain('Question: {{question}}');
  });
});
