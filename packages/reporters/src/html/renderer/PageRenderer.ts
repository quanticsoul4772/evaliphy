import type { RunReport } from '../../accumulator/RunReportBuilder.js';
import { styles } from '../assets/styles.js';
import { script } from '../assets/table.js';
import { formatDate } from '../helpers/formatters.js';
import { ResultsTable } from './ResultsTable.js';
import { SummarySection } from './SummarySection.js';

export class PageRenderer {
  static render(report: RunReport): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Evaliphy Report - ${report.meta.runId}</title>
  <style>${styles}</style>
</head>
<body>
  <header>
    <h1>Evaliphy Test Report</h1>
    <div class="meta-bar">
      <span>Run ID: <strong>${report.meta.runId}</strong></span>
      <span>Timestamp: <strong>${formatDate(report.meta.timestamp)}</strong></span>
      <span>Model: <strong>${report.meta.config.judge?.model || 'default'}</strong></span>
      ${report.meta.config.judge?.provider ? `<span>Provider: <strong>${report.meta.config.judge.provider}</strong></span>` : ''}
    </div>
  </header>

  <main>
    ${SummarySection.render(report)}
    ${ResultsTable.render(report.results)}
  </main>

  <script>
    window.__REPORT__ = ${JSON.stringify(report)};
    ${script}
  </script>
</body>
</html>
    `;
  }
}
