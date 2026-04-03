import type { RunReport } from '../../accumulator/RunReportBuilder.js';
import { getScoreColor } from '../helpers/colorScale.js';
import { formatDuration, formatPercent, formatScore } from '../helpers/formatters.js';

export class SummarySection {
  static render(report: RunReport): string {
    const { summary, meta } = report;
    
    return `
      <div class="summary-grid">
        <div class="card">
          <div class="card-title">Overall Pass Rate</div>
          <div class="card-value">${formatPercent(summary.passRate)}</div>
          <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${summary.passRate * 100}%; background-color: ${getScoreColor(summary.passRate)}"></div>
          </div>
          <div style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--gray-color);">
            ${summary.passed} passed / ${summary.failed} failed
          </div>
        </div>
        
        <div class="card">
          <div class="card-title">Total Duration</div>
          <div class="card-value">${formatDuration(meta.duration)}</div>
          <div style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--gray-color);">
            Across ${meta.evalFiles.length} eval files
          </div>
        </div>

        ${Object.entries(summary.byAssertion).map(([name, stats]) => `
          <div class="card">
            <div class="card-title">${name}</div>
            <div class="card-value">${formatPercent(stats.passRate)}</div>
            <div class="progress-bar-container">
              <div class="progress-bar" style="width: ${stats.passRate * 100}%; background-color: ${getScoreColor(stats.passRate)}"></div>
            </div>
            <div style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--gray-color); display: flex; justify-content: space-between;">
              <span>Avg Score: ${formatScore(stats.avgScore)}</span>
              <span>${stats.passed}/${stats.total}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}
