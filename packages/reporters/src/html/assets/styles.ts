export const styles = `
:root {
  --bg-color: #f9fafb;
  --text-color: #111827;
  --border-color: #e5e7eb;
  --card-bg: #ffffff;
  --primary-color: #2563eb;
  --success-color: #10b981;
  --failure-color: #ef4444;
  --warning-color: #f59e0b;
  --gray-color: #6b7280;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  margin: 0;
  padding: 2rem;
  line-height: 1.5;
}

header {
  margin-bottom: 2rem;
}

h1 {
  margin: 0;
  font-size: 1.875rem;
  font-weight: 700;
}

.meta-bar {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--gray-color);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 1.25rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--gray-color);
  margin-bottom: 0.5rem;
}

.card-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.progress-bar-container {
  height: 0.5rem;
  background-color: var(--border-color);
  border-radius: 9999px;
  margin-top: 1rem;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
}

.filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.filter-btn {
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  font-size: 0.875rem;
  cursor: pointer;
}

.filter-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

table {
  width: 100%;
  border-collapse: collapse;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  overflow: hidden;
}

th {
  text-align: left;
  padding: 0.75rem 1rem;
  background: #f3f4f6;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
}

td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.875rem;
  vertical-align: top;
}

tr.failed {
  background-color: #fef2f2;
}

tr.expandable {
  cursor: pointer;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-passed { background: #d1fae5; color: #065f46; }
.status-failed { background: #fee2e2; color: #991b1b; }
.status-error { background: #f3f4f6; color: #374151; }

.detail-row {
  display: none;
  background: #f9fafb;
}

.detail-row.open {
  display: table-row;
}

.detail-content {
  padding: 1.5rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.detail-section-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--gray-color);
  margin-bottom: 0.5rem;
}

.detail-box {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  padding: 0.75rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.8125rem;
  white-space: pre-wrap;
  max-height: 300px;
  overflow-y: auto;
}

.assertion-list {
  margin-top: 1rem;
}

.assertion-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.assertion-reason {
  font-size: 0.8125rem;
  color: var(--gray-color);
  margin-top: 0.25rem;
}
`;
