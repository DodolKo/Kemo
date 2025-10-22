export function packWidgets(list, cols) {
  // defensive guards to avoid unbounded memory usage / infinite loops
  cols = Number(cols) || 1
  if (!Number.isFinite(cols) || cols < 1) cols = 1
  // cap cols to a sane upper bound to avoid huge arrays
  const MAX_COLS = 100
  cols = Math.min(cols, MAX_COLS)

  const occupied = []

  const take = (x, y, w, h) => {
    for (let yy = y; yy < y + h; yy++) {
      occupied[yy] ||= Array(cols).fill(false)
      for (let xx = x; xx < x + w; xx++) occupied[yy][xx] = true
    }
  }

  const canFit = (x, y, w, h) => {
    if (x + w > cols) return false
    for (let yy = y; yy < y + h; yy++) {
      occupied[yy] ||= Array(cols).fill(false)
      for (let xx = x; xx < x + w; xx++) if (occupied[yy][xx]) return false
    }
    return true
  }

  // safety: don't search rows forever
  const MAX_ROWS = Math.max(1000, (list && list.length) * 10)
  const place = (w, h) => {
    let y = 0
    while (y <= MAX_ROWS) {
      occupied[y] ||= Array(cols).fill(false)
      for (let x = 0; x < cols; x++) if (canFit(x, y, w, h)) return { x, y }
      y++
    }
    // if we couldn't find a spot within limits, fallback to bottom-most row
    return { x: 0, y: MAX_ROWS }
  }

  const out = []
  for (const raw of list) {
    // validate and normalize sizes
    const w = Math.max(1, Math.min(cols, Math.floor((raw && raw.size && raw.size.w) || 1)))
    const h = Math.max(1, Math.floor((raw && raw.size && raw.size.h) || 1))
    const { x, y } = place(w, h)
    take(x, y, w, h)
    out.push({ ...raw, x, y, size: { w, h } })
  }

  return out
}
