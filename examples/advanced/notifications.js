import React from 'react'
import Notification from './notification'

const containerStyle = {
  position: 'fixed',
  bottom: 20,
  left: 20,
  display: 'flex',
  flexDirection: 'column'
}

class Notifications extends React.Component {
  static defaultProps = {
    notifications: []
  }

  render() {
    let { notifications: ns, callbacks } = this.props

    if (!ns.length) return null

    return (
      <div style={containerStyle}>
        {ns.map(n => (
          <Notification key={n.id} notification={n} callbacks={callbacks} />
        ))}
      </div>
    )
  }
}

export default Notifications
