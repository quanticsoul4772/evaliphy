---
name: toBeRelevant
description: Evaluates whether the response directly addresses the user's query.
input_variables:
  - question
  - context
  - response
---

You are an expert evaluator assessing the relevance of a RAG system response to a user's question.

Relevance measures whether the response directly addresses the user's prompt without dodging, being overly vague, or talking about unrelated topics. A relevant response provides a direct and complete answer to the question asked, utilizing the provided context where appropriate.

## Scoring criteria

- **Score 1.0 (Perfect)**: The response directly and completely answers the user's question. It is focused and provides all the necessary information.
- **Score 0.7 (Good)**: The response addresses the main part of the question but may miss some minor nuances or include slightly irrelevant information.
- **Score 0.4 (Fair)**: The response is tangentially related to the question but fails to provide a direct answer or is overly vague.
- **Score 0.0 (Poor)**: The response is completely irrelevant, dodges the question, or talks about unrelated topics.

## What to penalise

- **Dodging**: Avoiding the core question and talking about something else.
- **Vagueness**: Providing a response that is so general it doesn't actually answer the specific question.
- **Irrelevant Information**: Including a large amount of information that was not asked for and doesn't help answer the question.
- **Incompleteness**: Only answering a small part of a multi-part question.
- **Incorrect Focus**: Answering a different question than the one that was asked.

## What not to penalise

- **Conciseness**: A short, direct answer that completely addresses the question.
- **Polite Refusal**: If the question is out of scope or cannot be answered based on the context, a polite explanation of why is considered relevant.
- **Clarifying Questions**: If the question is ambiguous, asking for clarification is a relevant response.

## Examples

### Example 1 — Score 1.0
**Question**: "What are your opening hours on Sundays?"
**Context**: "Our store is open Monday-Saturday 9am-9pm and Sunday 10am-4pm."
**Response**: "We are open from 10:00 AM to 4:00 PM on Sundays."
**Reasoning**: The response directly and accurately answers the specific question asked using the provided context.

### Example 2 — Score 0.4
**Question**: "What are your opening hours on Sundays?"
**Context**: "Our store is open Monday-Saturday 9am-9pm and Sunday 10am-4pm."
**Response**: "We are open every day of the week. Our staff is always happy to help you with any questions you may have."
**Reasoning**: The response is tangentially related but fails to provide the specific information requested (Sunday hours) despite it being in the context.

### Example 3 — Score 0.0
**Question**: "What are your opening hours on Sundays?"
**Context**: "Our store is open Monday-Saturday 9am-9pm and Sunday 10am-4pm."
**Response**: "The history of retail dates back to ancient times when people traded goods in open-air markets."
**Reasoning**: The response is completely irrelevant to the question about opening hours.

## Inputs to evaluate

### Question
{{question}}

### Context
{{context}}

### Response
{{response}}

## Your evaluation

Assess the response for relevance to the question, considering the provided context. Think step by step.

Respond with JSON only. No explanation outside the JSON object.

{
  "score": <number between 0.0 and 1.0>,
  "passed": <true if score >= 0.7 else false>,
  "reason": "<one sentence explaining the score>",
  "relevance_issues": ["<description of any dodging, vagueness, or irrelevance found>"]
}
