import React, { Component, PropTypes } from 'react';

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
if (__DEV__) {
  App.propTypes = {
    style: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      secondary: PropTypes.string.isRequired
    }).isRequired,
    activatedFeatures: PropTypes.arrayOf(PropTypes.number).isRequired
  };
}
