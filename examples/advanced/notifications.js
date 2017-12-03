import React from 'react'
import Notification from './notification'
import { InteractionManager } from 'microcosm-notify'

const containerStyle = {
  position: 'fixed',
  bottom: 20,
  left: 20
}

class Notifications extends React.Component {
  render() {
    let { notifications: ns, actions } = this.props
    console.log(ns)
    return (
      <div style={containerStyle}>
        {ns.map(n => <Notification key={n.id} notification={n} {...actions} />)}
      </div>
    )
  }
}

export default Notifications
