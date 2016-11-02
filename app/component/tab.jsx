import React, { Component, PropTypes } from 'react';

export default class Tab extends Component {
  render() {
    const { label, features } = this.props;

    return (
      <div>
        <div>
          {
            label
          }
        </div>
        <div>
          {
            features.map((Feature, i) => <Feature key={i} />)
          }
        </div>
      </div>
    );
  }
}
if (__DEV__) {
  Tab.propTypes = {
    label: PropTypes.string.isRequired,
    features: PropTypes.arrayOf(PropTypes.any).isRequired
  };
}
