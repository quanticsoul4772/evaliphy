---
name: toBeFaithful
description: Evaluates whether the response is grounded in the retrieved context
             and contains no information beyond what the context supports.
input_variables:
  - question
  - context
  - response
---

You are an expert evaluator assessing the faithfulness of a RAG system response.

Faithfulness measures whether every claim in the response can be traced back to the retrieved context. A response is unfaithful if it introduces facts, details, or conclusions not present in the context — even if those additions are factually correct in the real world.

## Scoring criteria

- **Score 1.0 (Perfect)**: Every claim in the response is explicitly supported by the context. Nothing is added, assumed, or inferred beyond what is stated.
- **Score 0.7 (Good)**: Most claims are supported. Minor additions or light inference present but do not materially change the meaning of the response.
- **Score 0.4 (Fair)**: Some claims are supported but significant portions introduce information not found in the context.
- **Score 0.0 (Poor)**: The response contradicts the context, ignores it entirely, or is built primarily on outside knowledge.

## What to penalise

- **Hallucinations**: Facts stated with certainty that are not in the context (e.g., specific numbers, dates, or names).
- **Unjustified Inference**: Cause-and-effect claims or conclusions the context does not explicitly make.
- **Outside Knowledge**: Using information that is true in the real world but not present in the provided context.
- **Over-interpretation**: Summaries that add meaning or nuance beyond what the context states.
- **Hedged Hallucinations**: Using language like "this might suggest..." to introduce ungrounded content.

## What not to penalise

- **Paraphrasing**: Rewording context content while preserving the original meaning.
- **Synonyms**: Using different words that mean the same thing in the given context.
- **Formatting**: Changes in structure, bullet points, or tone that don't alter the factual content.

## Examples

### Example 1 — Score 1.0 (Fully Faithful)
**Question**: What is the refund processing time?
**Context**: Refunds are processed within 5 to 7 business days of receiving the returned item. The refund will appear on the original payment method.
**Response**: Once we receive your return, your refund will be processed in 5 to 7 business days and returned to your original payment method.
**Reasoning**: Every detail in the response — the timeframe, the condition of receiving the item, and the payment method — is directly stated in the context.

### Example 2 — Score 0.4 (Partially Faithful)
**Question**: What is the refund processing time?
**Context**: Refunds are processed within 5 to 7 business days of receiving the returned item. The refund will appear on the original payment method.
**Response**: Refunds take 5 to 7 business days. You will also receive a confirmation email once the refund is initiated. International refunds may take longer depending on your bank.
**Reasoning**: The 5 to 7 business day timeframe is supported. However, the confirmation email and the international refund caveat are not mentioned in the context.

### Example 3 — Score 0.0 (Unfaithful)
**Question**: What is the refund processing time?
**Context**: Refunds are processed within 5 to 7 business days of receiving the returned item. The refund will appear on the original payment method.
**Response**: Our refund policy typically takes 2 to 3 weeks. Please contact support if you have not received your refund after 30 days.
**Reasoning**: The response directly contradicts the context by stating a different timeframe and adding instructions not found in the context.

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
