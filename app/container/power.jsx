import React, { Component } from 'react';
import PowerIcon from 'material-ui/svg-icons/action/power-settings-new';
import Button from 'app/component/button.jsx';

export default class Power extends Component {
  static handlePress() {
    fetch('/power', { method: 'POST' });
  }
  static handleRelease() {
    fetch('/power', { method: 'DELETE' });
  }
  render() {
    return (
      <Button
        onPress={Power.handlePress}
        onRelease={Power.handleRelease}
      >
        <PowerIcon style={{ height: '100px', width: '100px' }} />
      </Button>
    );
  }
}
