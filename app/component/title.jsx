import React, { Component } from 'react';

export default class Title extends Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          fontSize: '30px',
          padding: '8px'
        }}
      >
        Desktop Controller
      </div>
    );
  }
}
