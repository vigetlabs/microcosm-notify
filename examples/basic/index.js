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

const actionParams = {
  delay: 3000,
  choices: [
    {
      text: 'Undo (z)',
      trigger: 'z',
      actions: [
        {
          action: actions.notify,
          params: {
            messages: [
              'Stand by, reversing time ...',
              '... eliminating paradoxes ...',
              'All done! We managed to avoid disaster... this time.'
            ],
            delay: 10000
          }
        },
        {
          action: actions.unnotify
        }
      ]
    }
  ]
}

class Basic extends Presenter {
  render() {
    return (
      <div>
        <ActionButton
          style={buttonStyle}
          action={actions.notify}
          value={actionParams}
          prepare={(value, event) => ({
            ...value,
            message: randomWords({ min: 6, max: 14, join: ' ' })
          })}
        >
          Test!
        </ActionButton>

        <Notifications>
          {({ notification, callbacks }) =>
            notification ? (
              <Notification
                key={notification.id}
                notification={notification}
                callbacks={callbacks}
              />
            ) : null
          }
        </Notifications>
      </div>
    )
  }
}

DOM.render(<Basic repo={repo} />, target)
