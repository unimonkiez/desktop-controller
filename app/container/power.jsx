import React, { Component } from 'react';
import PowerIcon from 'material-ui/svg-icons/action/power-settings-new';
import Button from 'app/component/button.jsx';

export default class Power extends Component {
  static handlePress() {
  }
  static handleRelease() {
  }
  render() {
    return (
      <Button
        onPress={Power.handlePress}
        onRelease={Power.handleRelease}
      >
        <PowerIcon style={{ height: 'auto', width: '4rem' }} />
      </Button>
    );
  }
}
