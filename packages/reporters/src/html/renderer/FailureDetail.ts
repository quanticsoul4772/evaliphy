import type { RunResult } from '../../accumulator/RunReportBuilder.js';
import { getScoreColor } from '../helpers/colorScale.js';
import { formatScore } from '../helpers/formatters.js';

export class FailureDetail {
  static render(result: RunResult): string {
    const assertions = Object.entries(result.assertions || {});
    
    return `
      <div class="detail-content">
        <div class="detail-grid">
          <div>
            <div class="detail-section-title">Query</div>
            <div class="detail-box">${this.escapeHtml(result.inputs.query || '')}</div>
            
            <div class="detail-section-title" style="margin-top: 1rem;">Context</div>
            <div class="detail-box">${this.escapeHtml(result.inputs.context || '')}</div>
          </div>
          <div>
            <div class="detail-section-title">Response</div>
            <div class="detail-box">${this.escapeHtml(result.inputs.response || '')}</div>
            
            <div class="detail-section-title" style="margin-top: 1rem;">Assertions</div>
            <div class="assertion-list">
              ${assertions.map(([name, data]) => `
                <div class="assertion-item ${data.passed ? 'passed' : 'failed'}" style="border-left: 4px solid ${data.passed ? 'var(--success-color)' : 'var(--failure-color)'}; padding: 12px; margin-bottom: 16px; background: var(--bg-color); border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                      <span style="font-weight: 700; font-size: 1.1rem; color: var(--text-color);">${name}</span>
                      <span class="status-badge status-${data.passed ? 'passed' : 'failed'}" style="font-size: 0.75rem; padding: 2px 8px; border-radius: 12px;">
                        ${data.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                    <div style="text-align: right;">
                      <div style="font-size: 0.85rem; color: var(--gray-color); margin-bottom: 2px;">Score</div>
                      <div style="font-size: 1.5rem; color: ${getScoreColor(data.score)}; font-weight: 800; line-height: 1;">${formatScore(data.score)}</div>
                    </div>
                  </div>
                  
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 12px; padding: 10px; background: rgba(0,0,0,0.02); border-radius: 4px;">
                    <div>
                      <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--gray-color); margin-bottom: 4px; font-weight: 600;">Expected</div>
                      <div style="font-size: 0.9rem; color: var(--text-color);">Score &ge; ${data.threshold ?? '0.7'}</div>
                    </div>
                    <div>
                      <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--gray-color); margin-bottom: 4px; font-weight: 600;">Actual</div>
                      <div style="font-size: 0.9rem; color: ${getScoreColor(data.score)}; font-weight: 600;">${formatScore(data.score)}</div>
                    </div>
                  </div>

                  <div style="margin-bottom: 12px;">
                    <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--gray-color); margin-bottom: 4px; font-weight: 600;">Judge Reasoning</div>
                    <div class="assertion-reason" style="font-size: 0.9rem; line-height: 1.5; color: var(--text-color);">${this.escapeHtml(data.reason || 'No reasoning provided.')}</div>
                  </div>

                  <div style="font-size: 0.75rem; color: var(--gray-color); padding-top: 8px; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between;">
                    <span>Model: <span style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; color: var(--text-color);">${data.model || 'unknown'}</span></span>
                    ${data.durationMs ? `<span>Duration: ${data.durationMs}ms</span>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        ${result.error ? `
          <div style="margin-top: 1rem;">
            <div class="detail-section-title">Error Stack</div>
            <div class="detail-box" style="color: var(--failure-color);">${this.escapeHtml(result.error.stack || result.error.message)}</div>
          </div>
        ` : ''}
      </div>
    `;
  }

  private static escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"')
      .replace(/'/g, '&#039;');
  }
}
