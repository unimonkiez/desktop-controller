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
      <Button
        onPress={Reset.handlePress}
        onRelease={Reset.handleRelease}
      >
        <ResetIcon style={{ height: 'auto', width: '4rem' }} />
      </Button>
    );
  }
}
