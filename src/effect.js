import pauseable from 'pauseable'
import Notification from './entity'
import { get } from 'microcosm'
import { show, hide, pause, resume } from './actions'

export default {
  setup(repo, { actions }) {
    this.actions = actions
    this.repo = repo
    this.queue = []

    this.reset()

    document.body.addEventListener(
      'keydown',
      this.handleKeyDown.bind(this),
      true
    )
  },

  reset() {
    this.timeout && this.timeout.clear()
    this.focus = null
  },

  register() {
    return {
      [this.actions.show]: this.enqueue,
      [this.actions.hide]: this.dequeue,
      [hide]: this.hide,
      [pause]: this.pause,
      [resume]: this.resume
    }
  },

  enqueue(_repo, params) {
    let n = new Notification(params)

    if (this.isImmediateNotification(n)) {
      this.handleImmediateNotification(n)
    } else {
      this.handleNotification(n)
    }
  },

  isImmediateNotification(n) {
    return (
      n.immediate && (get(this.n, 'interruptible', true) || n.forceImmediate)
    )
  },

  handleImmediateNotification(n) {
    if (this.focus) {
      if (this.focus.isDeferrable()) {
        this.queue.unshift(this.focus)
      }

      this.hideAndReset()
    }

    this.notify(n)
  },

  handleNotification(n) {
    this.queue.push(n)

    if (!this.paused && !this.focus) {
      this.next()
    }
  },

  dequeue(_repo) {
    if (this.focus) {
      this.next()
    }
  },

  next() {
    if (this.focus) {
      this.hideAndReset()
    }

    this.notify(this.queue.shift())
  },

  hideAndReset() {
    let n = this.focus

    this.reset()
    this.repo.push(hide, n)
  },

  notify(n) {
    if (!n) return

    this.focus = n
    this.focus.displayedAt = Date.now()

    this.repo.push(show, n).onDone(() => {
      this.timeout = pauseable.setTimeout(this.next.bind(this), n.delay)
    })
  },

  pause(_repo, n) {
    if (this.timeout && n.id === get(this.focus, 'id')) {
      this.focus = n
      this.timeout.pause()
    }
  },

  resume(_repo, n) {
    if (this.isPaused() && n.id === get(this.focus, 'id')) {
      this.focus = n
      this.timeout.resume()
    }
  },

  hide(_repo, { id }) {
    if (id === get(this.focus, 'id')) {
      this.reset()
      this.next()
    }
  },

  handleKeyDown(event) {
    if (!this.focus) return

    let task = this.focus.choices.find(
      a => get(a, 'trigger', '').toLowerCase() == event.key.toLowerCase()
    )

    if (get(task, 'actions.length')) {
      this.processTask(task)
    }
  },

  processTask(task) {
    task.actions.forEach(({ action, params }) => {
      if (action) {
        this.repo.push(action, params)
      }
    })

    if (this.focus.preventDefault) event.preventDefault()
    if (this.focus.stopPropagation) event.stopPropagation()
  },

  isPaused() {
    return this.timeout && !this.timeout.isDone() && this.timeout.isPaused()
  }
}
