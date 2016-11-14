import React, { Component, PropTypes } from 'react';
import PowerIcon from 'material-ui/svg-icons/action/power-settings-new';
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <div
          onTouchStart={this.handlePress}
          onMouseDown={this.handlePress}
          onTouchEnd={this.handleRelease}
          onMouseUp={this.handleRelease}
          style={{
            position: 'releative',
            height: '400px',
            width: '400px',
            borderRadius: '50%',
            backgroundColor: pressed ? Color(style.secondary).darken(0.2).rgbaString() : style.secondary,
            border: `2px solid ${Color(style.secondary).darken(0.4).rgbaString()}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: style.primary
          }}
        >
          <PowerIcon style={{ height: '100px', width: '100px' }} />
        </div>
      </div>
    );
  }
}
