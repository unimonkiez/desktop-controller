import React, { Component } from 'react';
import Toggle from 'material-ui/Toggle';
import fetchHandler from '../common/fetch-handler.js';

export default class UvLight extends Component {
  state = {
    on: false
  };
  handleToggle = this.handleToggle.bind(this);
  handleToggle() {
    if (!this.inProcess) {
      this.inProcess = true;
      const on = !this.state.on;
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
      <div>
        <Toggle
          toggled={on}
          onToggle={this.handleToggle}
          labelStyle={{ color: '#fff' }}
        />
      </div>
    );
  }
}
