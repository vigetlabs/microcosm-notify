import { get } from 'microcosm'
import Notification from './entity'
import { notify, unnotify, show, hide, reset, pause, resume } from './actions'

function without(arr, notification) {
  return arr.filter(n => n.id != notification.id)
}

class NotificationsEffect {
  static defaultOptions = {
    concurrency: 1,
    preventDefault: true,
    stopPropagation: true
  }

  setup(repo, options) {
    this.options = Object.assign({}, this.constructor.defaultOptions, options)
    this.repo = repo
    this.queue = []

    if (options.concurrency === 1) {
      document.body.addEventListener('keydown', this.handleKeyDown, true)
    }
  }

  teardown() {
    if (this.options.concurrency === 1) {
      document.body.removeEventListener('keydown', this.handleKeyDown, true)
    }
  }

  register() {
    return {
      [show]: {
        open: this.update,
        update: this.update,
        cancel: this.onComplete,
        error: this.onComplete,
        done: this.onComplete
      },
      [hide]: this.hide,
      [pause]: this.pause,
      [resume]: this.resume,

      [notify]: this.enqueue,
      [unnotify]: this.dequeue
    }
  }

  update(repo, notification) {
    if (this.has(notification)) {
      this.queue = this.queue.map(
        n => (n.id === notification.id ? notification : n)
      )

      this.repo.push(reset, this.queue)
    }
  }

  enqueue(repo, params) {
    let n = new Notification(params)

    this.queue = n.immediate ? [n, ...this.queue] : [...this.queue, n]
    this.repo.push(reset, this.queue)
  }

  dequeue(_repo, notification) {
    let payload = notification || this.queue[0]
    this.removeNotification(payload)
  }

  onComplete(_repo, notification) {
    this.removeNotification(notification)
  }

  pause(_repo, notification) {
    if (this.has(notification) && notification.__action__) {
      notification.__action__.update(notification.update({ paused: true }))
      notification.__timer__.pause()
    }
  }

  resume(_repo, notification) {
    if (this.has(notification) && notification.__action__) {
      notification.__action__.update(notification.update({ paused: false }))
      notification.__timer__.resume()
    }
  }

  hide(_repo, notification) {
    if (this.has(notification) && notification.__action__) {
      notification.__action__.cancel()
    }
  }

  handleKeyDown = event => {
    // handler only attached when concurrency is 1
    let notification = this.getCurrentItems()[0]
    if (!notification) return

    let task = notification.choices.find(
      a => get(a, 'trigger', '').toLowerCase() == event.key.toLowerCase()
    )

    if (get(task, 'actions.length')) {
      this.processTask(task)
    }
  }

  processTask(task) {
    task.actions.forEach(({ action, params, onClick = () => {} }) => {
      if (action) {
        this.repo.push(action, params).onDone(onClick)
      }
    })

    if (this.options.preventDefault) event.preventDefault()
    if (this.options.stopPropagation) event.stopPropagation()
  }

  removeNotification(notification) {
    if (this.has(notification)) {
      this.queue = without(this.queue, notification)
      this.repo.push(reset, this.queue)
    }
  }

  has(notification) {
    return this.getCurrentItems().find(n => n.id == notification.id)
  }

  getCurrentItems() {
    return this.queue.slice(0, this.options.concurrency)
  }
}

export default NotificationsEffect
