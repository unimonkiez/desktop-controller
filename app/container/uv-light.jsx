import React, { Component } from 'react';
import Switch from 'app/component/switch.jsx';
import fetchHandler from '../common/fetch-handler.js';

export default class UvLight extends Component {
  state = {
    on: false
  };
  handleCheckedChange = this.handleCheckedChange.bind(this);
  handleCheckedChange(on) {
    if (!this.inProcess) {
      this.inProcess = true;
      fetch('/uv', { method: on ? 'POST' : 'DELETE' })
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
      <Switch
        checked={on}
        onCheckedChange={this.handleCheckedChange}
      />
    );
  }
}
