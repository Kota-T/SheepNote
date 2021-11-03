export function isMobile(): boolean {
  return navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i) !== null || 'ontouchstart' in document
}
