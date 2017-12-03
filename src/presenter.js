import invariant from 'invariant'
import { get } from 'microcosm'
import PropTypes from 'prop-types'
import Presenter from 'microcosm/addons/presenter'
import Domain from './domain'
import { hide, pause, resume, notify, unnotify } from './actions'

class NotificationManager extends Presenter {
  static propTypes = {
    domainName: PropTypes.string,
    actions: PropTypes.shape({
      show: PropTypes.func,
      hide: PropTypes.func
    }),
    children: PropTypes.func
  }

  static defaultProps = {
    domainName: 'notifications',
    actions: {
      show: notify,
      hide: unnotify
    }
  }

  setup(repo, props) {
    invariant(
      !props.children ||
        (props.children && typeof props.children === 'function'),
      'microcosm-notify expected a function child but received something else'
    )

    repo.addDomain(props.domainName, Domain, { actions: props.actions })
  }

  getModel() {
    return {
      notifications: state => get(state, this.props.domainName, [])
    }
  }

  render() {
    let { children } = this.props
    let { notifications } = this.model

    if (!children) {
      return null
    }

    return children({
      notifications,
      notification: notifications[0],
      processActions: this.processActions,
      actions: {
        pause: this.pause,
        resume: this.resume,
        dismiss: this.dismiss
      }
    })
  }

  pause = notification => {
    let payload = notification || get(this.model, 'notifications[0]')
    this.repo.push(pause, payload)
  }

  resume = notification => {
    let payload = notification || get(this.model, 'notifications[0]')
    this.repo.push(resume, payload)
  }

  dismiss = notification => {
    let payload = notification || get(this.model, 'notifications[0]')
    this.repo.push(hide, payload)
  }

  processActions = (actions = []) => {
    actions.forEach(({ action, params }) => {
      this.repo.push(action, params)
    })
  }
}

export default NotificationManager
