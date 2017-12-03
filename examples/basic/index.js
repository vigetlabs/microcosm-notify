import React from 'react'
import DOM from 'react-dom'
import Microcosm from 'microcosm'
import Presenter from 'microcosm/addons/presenter'
import ActionButton from 'microcosm/addons/action-button'
import Notifications, { actions } from 'microcosm-notify'
import Notification from './notification'
import randomWords from 'random-words'

let target = document.getElementById('root')

let repo = new Microcosm()

const buttonStyle = {
  border: 0,
  padding: '12px 16px',
  fontSize: 14,
  lineHeight: 1,
  background: '#333',
  color: '#fff',
  fontWeight: 'bold',
  fontFamily: 'monospace'
}

class Basic extends Presenter {
  render() {
    return (
      <div>
        <ActionButton
          style={buttonStyle}
          action={actions.notify}
          prepare={(value, event) => ({
            message: randomWords({ min: 6, max: 14, join: ' ' })
          })}
        >
          Test!
        </ActionButton>

        <Notifications>
          {({ notification, actions }) =>
            notification ? (
              <Notification
                key={notification.id}
                notification={notification}
                {...actions}
              />
            ) : null
          }
        </Notifications>
      </div>
    )
  }
}

DOM.render(<Basic repo={repo} />, target)
