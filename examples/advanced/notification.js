import React from 'react'
import { InteractionManager } from 'microcosm-notify'

const notificationStyle = {
  border: '1px solid #333',
  padding: 8,
  marginTop: 8,
  textAlign: 'left'
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
  componentDidMount() {
    this.update()
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frame)
  }

  update() {
    this.frame = requestAnimationFrame(() => {
      this.forceUpdate()
      this.update()
    })
  }

  render() {
    let { notification } = this.props

    return (
      <InteractionManager style={notificationStyle} notification={notification}>
        {this.renderDismissButton()}
        <span style={messageStyle}>{notification.message}</span>
        <div
          style={{
            height: 2,
            background: 'blue',
            width: notification.getProgress() * 100 + '%'
          }}
        />
      </InteractionManager>
    )
  }

  renderDismissButton() {
    let { callbacks, notification } = this.props

    if (!notification.dismissable) {
      return
    }

    return (
      <div
        tabIndex="0"
        style={dismissStyle}
        onClick={() => callbacks.dismiss(notification)}
      >
        Close
      </div>
    )
  }
}

export default Notification
