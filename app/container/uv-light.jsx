import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Switch from 'app/component/switch.jsx';
import fetchHandler from 'app/common/fetch-handler.js';
import LightIcon from 'material-ui/svg-icons/action/lightbulb-outline';
import { SWITCH_MODE } from 'lib/constant.js';

export default class UvLight extends Component {
  state = {
    on: this.props.defaultStatus === SWITCH_MODE.ON
  };
  handleCheckedChange = this.handleCheckedChange.bind(this);
  handleCheckedChange(on) {
    if (!this.inProcess) {
      this.inProcess = true;
      Promise.resolve()
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
      >
        <LightIcon style={{ height: 'auto', width: '3rem', color: on ? '#3e0694' : '#000' }} />
      </Switch>
    );
  }
}
if (__DEV__) {
  UvLight.propTypes = {
    defaultStatus: PropTypes.oneOf(Object.keys(SWITCH_MODE).map(k => SWITCH_MODE[k])).isRequired
  };
}
