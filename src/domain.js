import Effect from './effect'
import { reset, update, pause, resume } from './actions'

class NotificationDomain {
  setup(repo, options) {
    repo.addEffect(Effect, options)
  }

  getInitialState() {
    return []
  }

  register() {
    return {
      [reset]: this.reset,
      [update]: this.update,
      [pause]: this.update,
      [resume]: this.update
    }
  }

  reset(_state, notifications) {
    return notifications
  }

  update(notifications, notification) {
    return notifications.map(n => {
      return n.id === notification.id ? notification : n
    })
  }
}

export default NotificationDomain
