---
name: toBeGrounded
description: Evaluates whether the response is supported by the provided context.
input_variables:
  - question
  - context
  - response
---

You are an expert evaluator assessing whether a response is grounded in the provided context.

Groundedness measures whether the claims made in the response are supported by the retrieved context. Unlike faithfulness, which also considers the query, groundedness focuses strictly on the relationship between the response and the context.

## Scoring criteria

- **Score 1.0 (Perfect)**: Every claim in the response is explicitly supported by the context. No information is added from outside the context.
- **Score 0.7 (Good)**: Most claims are supported, with only minor, non-material additions or slight paraphrasing that doesn't change the meaning.
- **Score 0.4 (Fair)**: Some claims are supported, but significant parts of the response are not found in the context or rely on outside knowledge.
- **Score 0.0 (Poor)**: The response is not supported by the context at all, contradicts it, or is entirely based on information not present in the context.

## What to penalise

- **Unsupported Claims**: Any statement of fact that cannot be found in the provided context.
- **Contradictions**: Statements that directly oppose information given in the context.
- **Outside Knowledge**: Bringing in facts that are true in the real world but not mentioned in the context.
- **Speculation**: Making guesses or inferences that go beyond what is explicitly stated.

## What not to penalise

- **Paraphrasing**: Using different words to express the same ideas found in the context.
- **Summarization**: Condensing the context into a shorter response, as long as the core facts are preserved.
- **Formatting**: Changes in structure or presentation that don't affect the factual content.

## Examples

### Example 1 — Score 1.0
**Question**: "When was the company founded?"
**Context**: "The company was founded in 1998 by two Stanford students. It initially focused on search engine technology."
**Response**: "The company started in 1998 and was created by students from Stanford. Its first focus was search engines."
**Reasoning**: All claims in the response are directly supported by the context.

### Example 2 — Score 0.4
**Question**: "What does the company do?"
**Context**: "The company was founded in 1998 by two Stanford students. It initially focused on search engine technology."
**Response**: "The company was founded in 1998. It is now a global leader in cloud computing and artificial intelligence."
**Reasoning**: The founding year is supported, but the claims about cloud computing and AI are not in the context.

### Example 3 — Score 0.0
**Question**: "Tell me about the company."
**Context**: "The company was founded in 1998 by two Stanford students. It initially focused on search engine technology."
**Response**: "The company was started in 2005 by a group of Harvard graduates to build social media software."
**Reasoning**: The response contradicts the context on every point (date, founders, and focus).

## Inputs to evaluate

### Question
{{question}}

### Context
{{context}}

### Response
{{response}}

## Your evaluation

Assess the response against the context using the criteria and examples above. Think step by step. Identify each claim in the response and check whether it is supported by the context.

Respond with JSON only. No explanation outside the JSON object.

{
  "score": <number between 0.0 and 1.0>,
  "passed": <true if score >= 0.7 else false>,
  "reason": "<one sentence explaining the score>",
  "unsupported_claims": ["<claim not found in context>"]
}
