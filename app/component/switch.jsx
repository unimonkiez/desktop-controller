import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Toggle from 'material-ui/Toggle';
import { Hoc as ContextHoc } from 'app/container/provider.js';
import Color from 'color';

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
      <div>
        <Toggle
          toggled={checked}
          onToggle={() => { this.handleToggle(!checked); }}
          labelStyle={{ color: textColor }}
        />
        {children}
      </div>
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
