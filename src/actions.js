/* default UI layer show/hide action defaults */
export const notify = x => x
export const unnotify = x => x

/* internal actions */
export const show = x => x
export const hide = x => x

export const pause = n =>
  n.update({
    paused: true,
    pausedAt: Date.now()
  })

export const resume = n =>
  n.update({
    paused: false,
    pausedAt: null,
    pauseTime: n.pauseTime + Date.now() - n.pausedAt
  })
