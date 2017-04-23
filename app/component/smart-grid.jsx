import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import smartGridStyle from './smart-grid.css';

export default class SmartGrid extends Component {
  renderChild = this.renderChild.bind(this);
  renderChild(child, index) {
    const { children } = this.props;
    const childrenCount = Children.count(children);

    return (
      <div
        style={{
          flex: `1 1 ${(index === 0 && childrenCount % 2 !== 0) ? 100 : 50}%`
        }}
      >
        {child}
      </div>
    );
  }
  render() {
    const {
      children
    } = this.props;

    return (
      <div
        className={smartGridStyle.main}
        style={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}
      >

        { Children.map(children, this.renderChild) }
      </div>
    );
  }
}

if (__DEV__) {
  SmartGrid.propTypes = {
    children: PropTypes.node
  };
}
