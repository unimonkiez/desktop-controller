import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Hoc as ContextHoc } from 'app/container/provider.js';
import { AUTO_RELEASE } from 'lib/constant.js';
import Color from 'color';

class Button extends Component {
  state = {
    pressed: false
  };
  handlePress = this.handlePress.bind(this);
  handlePress() {
    const { onPress } = this.props;
    this.setState({
      pressed: true
    }, onPress);
    setTimeout(this.handleRelease, AUTO_RELEASE);
  }
  handleRelease = this.handleRelease.bind(this);
  handleRelease() {
    const { onRelease } = this.props;
    if (this.state.pressed) {
      this.setState({
        pressed: false
      }, onRelease);
    }
  }
  render() {
    const {
      textColor,
      backgroundColor,
      pressedBackgroudColor,
      borderColor,
      children
    } = this.props;
    const { pressed } = this.state;

    return (
      <div
        onTouchStart={this.handlePress}
        onMouseDown={this.handlePress}
        onTouchEnd={this.handleRelease}
        onMouseUp={this.handleRelease}
        style={{
          position: 'releative',
          flex: '1 1',
          backgroundColor: pressed ? backgroundColor : pressedBackgroudColor,
          border: `2px solid ${borderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: textColor,
          boxSizing: 'border-box'
        }}
      >
        { children }
      </div>
    );
  }
}

if (__DEV__) {
  Button.propTypes = {
    textColor: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    pressedBackgroudColor: PropTypes.string.isRequired,
    borderColor: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    onRelease: PropTypes.func,
    children: PropTypes.node
  };
}

export default ContextHoc(ctx => ({
  textColor: Color(ctx.primaryColor).rgbaString(),
  backgroundColor: Color(ctx.secondaryColor).darken(0.2).rgbaString(),
  pressedBackgroudColor: Color(ctx.secondaryColor).rgbaString(),
  borderColor: Color(ctx.secondaryColor).darken(0.4).rgbaString()
}))(Button);
