import uuid from 'uuid'

class Notification {
  static defaults = {
    timeout: 5000,
    choices: [],
    messages: [],
    createdAt: null,
    displayedAt: null,
    lastPausedAt: null,
    lastResumedAt: null,
    pauseOnInteraction: true,
    paused: false,
    pauseTime: 0,
    dismissable: true, // can be dismissed
    interruptible: true, // can be interrupted by an immediate note
    reschedule: false, // persist interrupted notification in queue
    immediate: false, // show immediately
    forceImmediate: false // allow immediate note to interrupt uninterruptiple notes
  }

  constructor(params) {
    this._params = Object.assign({}, Notification.defaults, params)

    for (let param in this._params) {
      this[param] = this._params[param]
    }

    if (this.message && !('messages' in params)) {
      this.messages = [this.message]
    }

    if (this.messages && !('message' in params)) {
      this.message = this.messages[0]
    }

    this.id = this.id || uuid()
    this.createdAt = this.createdAt || Date.now()
  }

  getProgress() {
    if (this.timeout) {
      let remaining = (this.__timer__ && this.__timer__.next()) || this.timeout
      return (this.timeout - remaining) / this.timeout
    }

    return 0
  }

  update(params) {
    let allParams = { ...this, ...params }
    delete allParams._params
    return new Notification(allParams)
  }
}

export default Notification
