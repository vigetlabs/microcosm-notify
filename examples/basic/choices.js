import React from 'react'

class Choices extends React.Component {
  render() {
    return <div>{this.props.choices.map(this.renderAction, this)}</div>
  }

  renderAction({ text, trigger, actions }, i) {
    let contents = text ? text : `Press "${trigger.toUpperCase()}"`

    return (
      <button
        className="notification-choice"
        onClick={() => actions && this.props.processActions(actions)}
        key={i}
      >
        {contents}
      </button>
    )
  }
}

export default Choices
