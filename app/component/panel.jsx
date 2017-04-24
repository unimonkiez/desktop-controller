import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Hoc as ContextHoc } from 'app/container/provider.js';
import Color from 'color';
import PanelScrew from './panel-screw.jsx';

class Panel extends Component {
  static screwPadding = 4;
  static screwSize = 18;
  static renderScrew({
    top = false,
    right = false,
    bottom = false,
    left = false
  } = {}) {
    return (
      <div
        style={{
          position: 'absolute',
          top: top ? `${Panel.screwPadding}px` : undefined,
          right: right ? `${Panel.screwPadding}px` : undefined,
          bottom: bottom ? `${Panel.screwPadding}px` : undefined,
          left: left ? `${Panel.screwPadding}px` : undefined
        }}
      >
        <PanelScrew
          size={Panel.screwSize}
        />
      </div>
    );
  }
  render() {
    const {
      children,
      borderColor
    } = this.props;

    return (
      <div
        style={{
          border: `1px solid ${borderColor}`,
          height: '100%',
          boxSizing: 'border-box',
          position: 'relative',
          padding: `${Panel.screwSize + (Panel.screwPadding * 2)}px`
        }}
      >
        { children }
        { Panel.renderScrew({ top: true, left: true })}
        { Panel.renderScrew({ top: true, right: true })}
        { Panel.renderScrew({ bottom: true, left: true })}
        { Panel.renderScrew({ bottom: true, right: true })}
      </div>
    );
  }
}

if (__DEV__) {
  Panel.propTypes = {
    borderColor: PropTypes.string,
    children: PropTypes.node
  };
}
export default ContextHoc(ctx => ({
  borderColor: Color(ctx.secondaryColor).darken(0.2).rgbaString()
}))(Panel);
