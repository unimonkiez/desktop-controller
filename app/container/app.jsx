import React, { Component } from 'react';

export default class App extends Component {
  static handlePowerPress(e) {
    e.preventDefault();
    fetch('/power', {
      method: 'POST'
    });
  }
  static handlePowerRelease(e) {
    e.preventDefault();
    fetch('/power', {
      method: 'DELETE'
    });
  }
  render() {
    return (
      <div>
        HELLO im an app
        <button onTouchStart={App.handlePowerPress} onMouseDown={App.handlePowerPress} onTouchEnd={App.handlePowerRelease} onMouseUp={App.handlePowerRelease}>
          Power
        </button>
      </div>
    );
  }
}
