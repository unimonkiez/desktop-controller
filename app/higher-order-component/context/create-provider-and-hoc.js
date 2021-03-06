import uuid from 'uuid/v4';
import { Component } from 'react';
import PropTypes from 'prop-types';
import getPropsContextHoc from './get-props-context-hoc.js';

export default contextTypesObj => {
  const contextObjectName = `contextProvider-${uuid()}`;
  const contextObjectMapFn = ctx => ctx[contextObjectName];
  const contextTypes = {
    [contextObjectName]: PropTypes.shape(contextTypesObj)
  };
  class ContextProvider extends Component {
    static childContextTypes = contextTypes;
    getChildContext() {
      // Filtering out children
      // eslint-disable-next-line no-unused-vars
      const { children, ...otherProps } = this.props;
      return {
        [contextObjectName]: otherProps
      };
    }
    render() {
      return this.props.children;
    }
  }
  if (__DEV__) {
    ContextProvider.propTypes = {
      children: PropTypes.node,
      ...contextTypesObj
    };
  }
  return {
    Provider: ContextProvider,
    Hoc: getPropsContextHoc(contextTypes, contextObjectMapFn)
  };
};
