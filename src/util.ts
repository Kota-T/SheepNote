export function isMobile(): boolean {
  return navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i) !== null || 'ontouchstart' in document
}

export function flattenShallowly(arr: any[]): any[] {
  return arr.reduce((acc: any[], val: any) => {
    return Array.isArray(val) ? acc.concat(val) : [...acc, val]
  }, [])
}
