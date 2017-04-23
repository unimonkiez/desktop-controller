import React, { Component } from 'react';
import Switch from 'app/component/switch.jsx';
import fetchHandler from '../common/fetch-handler.js';

export default class Wifi extends Component {
  state = {
    on: false
  };
  handleCheckedChange = this.handleCheckedChange.bind(this);
  handleCheckedChange(on) {
    if (!this.inProcess) {
      this.inProcess = true;
      fetch('/wifi', { method: on ? 'POST' : 'DELETE' })
      .then(fetchHandler)
      .then(() => {
        this.setState({ on }, () => {
          this.inProcess = undefined;
        });
      });
    }
  }
  render() {
    const { on } = this.state;
    return (
      <div>
        <Switch
          checked={on}
          onCheckedChange={this.handleCheckedChange}
        />
      </div>
    );
  }
}
