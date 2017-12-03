import invariant from 'invariant'
import PropTypes from 'prop-types'
import Presenter from 'microcosm/addons/presenter'
import Domain from './domain'
import { pause, resume, show, hide } from './actions'

class NotificationManager extends Presenter {
  static propTypes = {
    domainName: PropTypes.string,
    concurrency: PropTypes.number,
    preventDefault: PropTypes.bool,
    stopPropagation: PropTypes.bool,
    children: PropTypes.func
  }

  static defaultProps = {
    domainName: 'notifications',
    concurrency: 1,
    preventDefault: true,
    stopPropagation: true
  }

  setup(repo, props) {
    invariant(
      !props.children ||
        (props.children && typeof props.children === 'function'),
      'microcosm-notify expected a function child but received something else'
    )

    invariant(
      typeof props.concurrency == 'number' && props.concurrency >= 1,
      'microcosm-notify requires that concurrency be a positive integer greater than 0'
    )

    repo.addDomain(props.domainName, Domain, {
      preventDefault: props.preventDefault,
      stopPropagation: props.stopPropagation,
      concurrency: props.concurrency
    })
  }

  getModel() {
    let { concurrency, domainName } = this.props

    return {
      notifications: state => (state[domainName] || []).slice(0, concurrency)
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
      callbacks: {
        onShow: this.onShow,
        onHide: this.onHide,
        pause: this.pause,
        resume: this.resume,
        dismiss: this.dismiss,
        processActions: this.processActions
      }
    })
  }

  pause = notification => {
    let payload = notification || this.model.notifications[0]
    this.repo.push(pause, payload)
  }

  resume = notification => {
    let payload = notification || this.model.notifications[0]
    this.repo.push(resume, payload)
  }

  dismiss = (notification, { force = false } = {}) => {
    let payload = notification || this.model.notifications[0]

    if (notification.dismissable || force) {
      this.repo.push(hide, payload)
    }
  }

  onShow = notification => {
    this.repo.push(show, notification)
  }

  onHide = notification => {
    this.repo.push(hide, notification)
  }

  processActions = (actions = []) => {
    actions.forEach(({ action, params }) => {
      this.repo.push(action, params)
    })
  }
}

export default NotificationManager
