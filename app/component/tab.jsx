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
            features.map((Feature, i) => (
              <div key={i} style={{ padding: '20px' }}>
                <Feature />
              </div>
            ))
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
