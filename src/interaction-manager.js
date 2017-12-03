import React from 'react'
import Presenter from 'microcosm/addons/presenter'
import PropTypes from 'prop-types'
import { pause, resume, show, hide } from './actions'

class InteractionManager extends Presenter {
  static propTypes = {
    component: PropTypes.node,
    forceDismiss: PropTypes.bool,
    notification: PropTypes.object.isRequired,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onClick: PropTypes.func
  }

  static defaultProps = {
    forceDismiss: false,
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onFocus: () => {},
    onBlur: () => {},
    onClick: () => {}
  }

  componentDidMount() {
    this.repo.push(show, this.props.notification)
  }

  componentWillUnmount() {
    this.repo.push(hide, this.props.notification)
  }

  render() {
    /* eslint-disable no-unused-vars */
    let {
      component,
      notification,
      children,
      forceDismiss,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      onClick,
      dismiss,
      ...props
    } = this.props
    /* eslint-enable no-unused-vars */

    let Component = component || notification.dismissable ? 'button' : 'div'

    let handlers = notification.pauseOnInteraction
      ? {
          onMouseEnter: this.onMouseEnter,
          onMouseLeave: this.onMouseLeave,
          onFocus: this.onFocus,
          onBlur: this.onBlur
        }
      : {}

    return (
      <Component {...handlers} {...props} onClick={this.onClick}>
        {children}
      </Component>
    )
  }

  onMouseEnter = event => {
    this.props.onMouseEnter(event)
    this.repo.push(pause, this.props.notification)
  }

  onMouseLeave = event => {
    this.props.onMouseLeave(event)
    this.repo.push(resume, this.props.notification)
  }

  onFocus = event => {
    this.props.onFocus(event)
    this.repo.push(pause, this.props.notification)
  }

  onBlur = event => {
    this.props.onBlur(event)
    this.repo.push(resume, this.props.notification)
  }

  onClick = event => {
    let { notification, onClick, forceDismiss } = this.props

    onClick(event)

    if (notification.dismissable || forceDismiss) {
      this.repo.push(hide, notification)
    }
  }
}

export default InteractionManager
