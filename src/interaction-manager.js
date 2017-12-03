import React from 'react'
import Presenter from 'microcosm/addons/presenter'
import PropTypes from 'prop-types'
import { pause, resume } from './actions'

class PauseManager extends Presenter {
  static propTypes = {
    component: PropTypes.node,
    notification: PropTypes.object.isRequired,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func
  }

  static defaultProps = {
    component: 'div',
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onFocus: () => {},
    onBlur: () => {}
  }

  render() {
    /* eslint-disable no-unused-vars */
    let {
      component: Component,
      notification,
      children,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      ...props
    } = this.props
    /* eslint-enable no-unused-vars */

    return (
      <Component
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        {...props}
      >
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
    this.repo.push(pause, this.props.notification)
  }

  onFocus = event => {
    this.props.onFocus(event)
    this.repo.push(pause, this.props.notification)
  }

  onBlur = event => {
    this.props.onBlur(event)
    this.repo.push(resume, this.props.notification)
  }
}

export default PauseManager
