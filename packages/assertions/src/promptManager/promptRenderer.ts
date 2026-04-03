import {AssertionDefinition, OutputSchema} from "../registry.js";

export class PromptRenderer {
  static render(
    template: string,
    variables: Record<string, string>,
    assertion: AssertionDefinition
  ): string {
    // 1. Fill user's {{variables}}
    const filled = this.fillTemplate(template, variables);

    // 2. Always append the output schema — user cannot override this
    const outputBlock = this.buildOutputBlock(assertion.outputSchema);

    return `${filled}\n\n${outputBlock}`;
  }

  private static fillTemplate(template: string, variables: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] !== undefined ? variables[key] : match;
    });
  }

  private static buildOutputBlock(schema: OutputSchema): string {
    return `
## Required Output Format
You must respond with this exact JSON structure and nothing else.
No markdown, no explanation, no preamble.

${JSON.stringify(schema.example, null, 2)}

Field definitions:
${schema.fields.map(f => `- ${f.name} (${f.type}): ${f.description}`).join('\n')}
`.trim();
  }
}
