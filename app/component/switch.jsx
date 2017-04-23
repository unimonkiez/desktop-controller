import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Hoc as ContextHoc } from 'app/container/provider.js';
import Color from 'color';
import switchStyle from './switch.css';

class Switch extends Component {
  handleToggle(checked) {
    const { onCheckedChange } = this.props;
    if (onCheckedChange) {
      onCheckedChange(checked);
    }
  }
  render() {
    const {
      checked,
      textColor,
      children
    } = this.props;

    return (
      <label
        className={switchStyle.main}
        style={{
          color: textColor
        }}
      >
        <input
          className={switchStyle.input}
          checked={checked}
          onChange={() => this.handleToggle(!checked)}
          type="checkbox"
        />
        <span className={switchStyle.strip}>
          {children}
        </span>
      </label>
    );
  }
}
if (__DEV__) {
  Switch.propTypes = {
    checked: PropTypes.bool.isRequired,
    onCheckedChange: PropTypes.func.isRequired,
    textColor: PropTypes.string.isRequired,
    children: PropTypes.node
  };
}
export default ContextHoc(ctx => ({
  textColor: Color(ctx.primaryColor).rgbaString()
}))(Switch);
