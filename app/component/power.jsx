import React, { Component, PropTypes } from 'react';
import Color from 'color';
import { AUTO_RELEASE } from '../../constant.js';

export default class Power extends Component {
  static contextTypes = {
    style: PropTypes.object.isRequired
  };
  state = {
    pressed: false
  };
  handlePress = this.handlePress.bind(this);
  handlePress() {
    fetch('/power', { method: 'POST' }).then(() => {
      this.setState({
        pressed: true
      });
      setTimeout(() => {
        this.setState({
          pressed: false
        });
      }, AUTO_RELEASE);
    });
  }
  handleRelease = this.handleRelease.bind(this);
  handleRelease() {
    if (this.state.pressed) {
      fetch('/power', { method: 'DELETE' }).then(() => {
        this.setState({
          pressed: false
        });
      });
    }
  }
  render() {
    const { pressed } = this.state;
    const { style } = this.context;

    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-flex' }}>
          <span
            onTouchStart={this.handlePress}
            onMouseDown={this.handlePress}
            onTouchEnd={this.handleRelease}
            onMouseUp={this.handleRelease}
            style={{
              position: 'releative',
              padding: '200px',
              borderRadius: '50%',
              backgroundColor: pressed ? Color(style.secondary).darken(0.2).rgbaString() : style.secondary,
              border: `2px solid ${Color(style.secondary).darken(0.4).rgbaString()}`
            }}
          >
            <span style={{ position: 'absolute', width: '100%', left: '0', textAlign: 'center', fontSize: '2rem', color: style.primary }}>
              Power
            </span>
          </span>
        </div>
      </div>
    );
  }
}
