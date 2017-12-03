import Effect from './effect'
import { show, hide, pause, resume } from './actions'

class NotificationDomain {
  setup(repo, { actions }) {
    repo.addEffect(Effect, { actions })
  }

  getInitialState() {
    return []
  }

  register() {
    return {
      [show]: this.add,
      [hide]: this.remove,
      [pause]: this.pause,
      [resume]: this.resume
    }
  }

  add(notifications, notification) {
    return notifications.concat([notification])
  }

  remove(notifications, notification) {
    return notifications.filter(n => n.id !== notification.id)
  }

  pause(notifications, notification) {
    return notifications.map(n => {
      return n.id === notification.id ? notification : n
    })
  }

  resume(notifications, notification) {
    return notifications.map(n => {
      return n.id === notification.id ? notification : n
    })
  }
}

export default NotificationDomain
