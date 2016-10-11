import React, { Component } from 'react';

export default class App extends Component {
  static handlePowerPress() {
    if (__DEVSERVER__) {
      console.log('power press!');
    } else {
      fetch('/power', {
        method: 'POST'
      });
    }
  }
  static handlePowerRelease() {
    if (__DEVSERVER__) {
      console.log('power release!');
    } else {
      fetch('/power', {
        method: 'DELETE'
      });
    }
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
