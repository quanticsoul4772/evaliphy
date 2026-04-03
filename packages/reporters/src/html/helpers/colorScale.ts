/**
 * Maps a score (0.0 - 1.0) to a CSS color string.
 * 0.0 – 0.5   →  red
 * 0.5 – 0.75  →  amber
 * 0.75 – 1.0  →  green
 */
export function getScoreColor(score: number): string {
  if (score < 0.5) {
    return '#ef4444'; // red-500
  }
  if (score < 0.75) {
    return '#f59e0b'; // amber-500
  }
  return '#10b981'; // emerald-500
}

/**
 * Maps a status to a CSS color string.
 */
export function getStatusColor(status: 'passed' | 'failed' | 'error'): string {
  switch (status) {
    case 'passed':
      return '#10b981'; // emerald-500
    case 'failed':
      return '#ef4444'; // red-500
    case 'error':
      return '#6b7280'; // gray-500
    default:
      return '#6b7280';
  }
}
