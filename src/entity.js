import uuid from 'uuid'

class Notification {
  static defaults = {
    delay: 5000,
    choices: [],
    messages: [],
    createdAt: null,
    displayedAt: null,
    pausedAt: null,
    pauseTime: 0,
    paused: false,
    dismissable: true,
    interruptible: true,
    immediate: false,
    forceImmediate: false,
    showProgress: true,
    minimumDelay: 1000,
    metadata: {},
    preventDefault: true,
    stopPropagation: true
  }

  constructor(params) {
    this._params = Object.assign({}, Notification.defaults, params)

    for (let param in this._params) {
      this[param] = this._params[param]
    }

    if (this.message && !('messages' in params)) {
      this.messages = [this.message]
    }

    this.id = this.id || uuid()
    this.delay = Math.max(this.delay, this.minimumDelay)
    this.createdAt = this.createdAt || Date.now()
  }

  isDeferrable() {
    return !this.dismissable && this.interruptible
  }

  update(params) {
    let allParams = { ...this, ...params }
    delete allParams._params
    return new Notification(allParams)
  }
}

export default Notification
