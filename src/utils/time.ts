export const getFormattedTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600) + ''
  const m = Math.floor(seconds % 3600 / 60) + ''
  const s = seconds % 3600 % 60 + ''
  return `${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}`
}
