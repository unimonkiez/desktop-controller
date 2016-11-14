import React, { Component } from 'react';
import fetchHandler from '../common/fetch-handler.js';
import Toggle from 'material-ui/Toggle';

export default class Wifi extends Component {
  state = {
    on: false
  };
  handleToggle = this.handleToggle.bind(this);
  handleToggle() {
    if (!this.inProcess) {
      this.inProcess = true;
      const on = !this.state.on;
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
        <Toggle
          toggled={on}
          onToggle={this.handleToggle}
          labelStyle={{ color: '#fff' }}
        />
      </div>
    );
  }
}
