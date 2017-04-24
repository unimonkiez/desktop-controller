import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircleIcon from 'material-ui/svg-icons/content/add-circle';

const getRandomArbitrary = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export default class Panel extends Component {
  static defaultProps = {
    color: 'gray',
    innerColor: '#000'
  }
  componentWillMount() {
    this.state = {
      rotation: getRandomArbitrary(0, 99)
    };
  }
  render() {
    const {
      size,
      color,
      innerColor
    } = this.props;
    const {
      rotation
    } = this.state;

    return (
      <div
        style={{
          transform: `rotateZ(${(rotation * 360) / 100}deg)`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '50%',
          backgroundColor: innerColor
        }}
      >
        <CircleIcon
          color={color}
          style={{
            width: `${size}px`,
            height: `${size}px`
          }}
        />
      </div>
    );
  }
}

if (__DEV__) {
  Panel.propTypes = {
    color: PropTypes.string,
    innerColor: PropTypes.string,
    size: PropTypes.number.isRequired
  };
}
