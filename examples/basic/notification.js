import React from 'react'
import { InteractionManager } from 'microcosm-notify'

const containerStyle = {
  position: 'fixed',
  bottom: 20,
  left: 20
}

const notificationStyle = {
  border: '1px solid #333',
  padding: 8
}

const dismissStyle = {
  textTransform: 'uppercase',
  fontSize: 11,
  border: 0,
  display: 'inline-block',
  background: 'none',
  padding: 8,
  fontWeight: 'bold'
}

const messageStyle = {
  fontFamily: 'Roboto',
  fontSize: 12,
  padding: 8
}

class Notification extends React.Component {
  render() {
    let { notification: n, dismiss } = this.props

    return (
      <div style={containerStyle}>
        <InteractionManager
          style={notificationStyle}
          component={n.dismissable ? 'button' : 'div'}
          onClick={n.dismissable ? () => dismiss(n) : null}
          notification={n}
        >
          {this.renderDismissButton()}
          <span style={messageStyle}>{n.message}</span>
        </InteractionManager>
      </div>
    )
  }

  renderDismissButton() {
    let { dismiss, notification } = this.props

    if (!notification.dismissable) {
      return
    }

    return (
      <div
        tabIndex="0"
        style={dismissStyle}
        onClick={() => dismiss(notification)}
      >
        Close
      </div>
    )
  }
}

export default Notification
