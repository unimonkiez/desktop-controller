import React from 'react';
import PropTypes from 'prop-types';
import { Hoc as ContextHoc } from 'app/container/provider.js';
import Tabs from 'app/component/tabs.jsx';
import Color from 'color';

const Component = (
  {
    textColor,
    backgroundColor
  }
) => (
  <div
    style={{
      color: textColor,
      backgroundColor
    }}
  >
    <Tabs />
  </div>
);

if (__DEV__) {
  Component.propTypes = {
    textColor: PropTypes.string,
    backgroundColor: PropTypes.string
  };
}

export default ContextHoc(ctx => ({
  textColor: Color(ctx.secondaryColor).rgbaString(),
  backgroundColor: Color(ctx.primaryColor).rgbaString()
}))(Component);
