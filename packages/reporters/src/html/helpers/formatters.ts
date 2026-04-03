/**
 * Formats a duration in milliseconds to a human-readable string.
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Formats a number as a percentage.
 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

/**
 * Formats an ISO timestamp to a readable date string.
 */
export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleString();
}

/**
 * Formats a score to 2 decimal places.
 */
export function formatScore(score: number): string {
  return score.toFixed(2);
}
