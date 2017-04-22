import React, { Component } from 'react';
import ResetIcon from 'material-ui/svg-icons/av/replay';
import Button from 'app/component/button.jsx';

export default class Reset extends Component {
  static handlePress() {
    fetch('/reset', { method: 'POST' });
  }
  static handleRelease() {
    fetch('/reset', { method: 'DELETE' });
  }
  render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Button
          onPress={Reset.handlePress}
          onRelease={Reset.handleRelease}
        >
          <ResetIcon style={{ height: '100px', width: '100px' }} />
        </Button>
      </div>
    );
  }
}
