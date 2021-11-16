export function isMobile(): boolean {
  return navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i) !== null || 'ontouchstart' in document
}

export function flattenShallowly(arr: any[]): any[] {
  return arr.reduce((acc: any[], val: any) => {
    return Array.isArray(val) ? acc.concat(val) : [...acc, val]
  }, [])
}

export function date2string(date: Date): string {
  return `
    ${ date.getFullYear() }年
    ${ date.getMonth() + 1 }月
    ${ date.getDate() }日
    (${ ['日', '月', '火', '水', '木', '金', '土'][date.getDay()] })
    ${ date.getHours() }時
    ${ date.getMinutes() }分
  `
}
