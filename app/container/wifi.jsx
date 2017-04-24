import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Switch from 'app/component/switch.jsx';
import fetchHandler from 'app/common/fetch-handler.js';
import WifiIcon from 'material-ui/svg-icons/action/settings-input-antenna';
import { SWITCH_MODE } from 'lib/constant.js';

export default class Wifi extends Component {
  state = {
    on: this.props.defaultStatus === SWITCH_MODE.ON
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
      <Switch
        checked={on}
        onCheckedChange={this.handleCheckedChange}
      >
        <WifiIcon style={{ height: 'auto', width: '2.5rem', color: on ? '#fff' : '#000' }} />
      </Switch>
    );
  }
}
if (__DEV__) {
  Wifi.propTypes = {
    defaultStatus: PropTypes.oneOf(Object.keys(SWITCH_MODE).map(k => SWITCH_MODE[k])).isRequired
  };
}
