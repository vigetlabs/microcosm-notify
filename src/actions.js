import pauseable from 'pauseable'

/* default UI layer show/hide action defaults */
export const notify = n => n
export const unnotify = x => x

/* internal actions */
export const show = n => {
  return (action, repo) => {
    let timer = null

    if (n.timeout > 0) {
      timer = pauseable.setTimeout(resolve, n.timeout)
    }

    let notification = n.update({
      displayedAt: Date.now(),
      __timer__: timer,
      __action__: action
    })

    action.open(notification)

    action.onCancel(cleanup)
    action.onError(cleanup)

    function cleanup() {
      if (timer) {
        timer.clear()
        timer = null
      }

      return notification
    }

    function resolve() {
      action.resolve(notification)
    }
  }
}

export const hide = n => n
export const reset = n => n
export const update = n => n
export const pause = n => n
export const resume = n => n
