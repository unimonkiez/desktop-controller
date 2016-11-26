import React, { Component } from 'react';
import Toggle from 'material-ui/Toggle';
import { SketchPicker } from 'react-color';
import Color from 'color';
import fetchHandler from '../common/fetch-handler.js';

export default class Led extends Component {
  state = {
    on: false,
    color: 'rgba(255, 255, 255, 0)'
  };
  handleToggle = this.handleToggle.bind(this);
  handleColorChange = this.handleColorChange.bind(this);
  handleToggle() {
    if (!this.inProcess) {
      this.inProcess = true;
      const { color, on: prevOn } = this.state;
      const on = !prevOn;
      fetch(`/led${on ? `/${color}` : ''}`, { method: on ? 'POST' : 'DELETE' })
      .then(fetchHandler)
      .then(() => {
        this.setState({ on }, () => {
          this.inProcess = undefined;
        });
      });
    }
  }
  handleColorChange({ hex }) {
    if (!this.inProcess && this.state.on) {
      const color = Color(hex).rgbaString();
      this.inProcess = true;
      fetch(`/led/${color}`, { method: 'PUT' })
      .then(fetchHandler)
      .then(() => {
        this.setState({ color }, () => {
          this.inProcess = undefined;
        });
      });
    }
  }
  render() {
    const { on, color } = this.state;
    const colorObj = Color(color);
    return (
      <div>
        <Toggle
          toggled={on}
          onToggle={this.handleToggle}
          labelStyle={{ color: '#fff' }}
        />
        { on &&
          <SketchPicker
            color={{ r: colorObj.red(), g: colorObj.green(), b: colorObj.blue() }}
            onChangeComplete={this.handleColorChange}
          />
        }
      </div>
    );
  }
}
