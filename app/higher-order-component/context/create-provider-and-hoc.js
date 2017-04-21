import uuid from 'uuic/v4';
import { Component, createElement, PropTypes } from 'react';

import { Component,  } from 'react';
import hoistStatics from 'hoist-non-react-statics';

const getPropsContextHoc = (contextTypes, contextObjectMapFn) => (contextMapFn, options = {}) => {
  const { withRef = false, mapFnForProperty = {} } = options;
  return WrappedComponent => {
    class ReactPropsContextWrapper extends Component {
      static contextTypes = contextTypes;

      render() {
        const contextObj = contextObjectMapFn(this.context);
        const contextPropsToMerge = contextObj !== undefined ? contextMapFn(contextObj) : {};

        const props = {
          ...contextPropsToMerge,
          ...this.props
        };

        Object.keys(mapFnForProperty).forEach(propertyName => {
          props[propertyName] = mapFnForProperty[propertyName](contextPropsToMerge[propertyName], this.props[propertyName]);
        });

        return createElement(WrappedComponent, {
          ...props,
          ref: withRef ? 'wrappedInstance' : undefined
        });
      }
      getWrappedInstance() {
        if (__DEV__ && !withRef) {
          throw new Error('To access the wrapped instance, you need to specify ' +
          '{ withRef: true } as the fourth argument of the connect() call.');
        }
        // Using function ref will replace instance with null for no reason..
        // eslint-disable-next-line react/no-string-refs
        return this.refs.wrappedInstance;
      }
    }

    return hoistStatics(ReactPropsContextWrapper, WrappedComponent);
  };
};

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
