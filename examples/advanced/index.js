import React from 'react'
import DOM from 'react-dom'
import Microcosm from 'microcosm'
import Presenter from 'microcosm/addons/presenter'
import ActionButton from 'microcosm/addons/action-button'
import NotificationsManager, { actions } from 'microcosm-notify'
import Notifications from './notifications'
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

class Advanced extends Presenter {
  render() {
    return (
      <div>
        <ActionButton
          style={buttonStyle}
          action={actions.notify}
          prepare={() => ({
            message: randomWords({ min: 6, max: 14, join: ' ' })
          })}
        >
          Test!
        </ActionButton>

        <NotificationsManager concurrency={3}>
          {({ notifications, callbacks }) => (
            <Notifications
              notifications={notifications}
              callbacks={callbacks}
            />
          )}
        </NotificationsManager>
      </div>
    )
  }
}

DOM.render(<Advanced repo={repo} />, target)
