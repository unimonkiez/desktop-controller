import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Switch from 'app/component/switch.jsx';
import { SketchPicker } from 'react-color';
import Color from 'color';
import fetchHandler from 'app/common/fetch-handler.js';
import LedIcon from 'material-ui/svg-icons/action/invert-colors';
import { COLOR_MODE } from 'lib/constant.js';

export default class Led extends Component {
  state = {
    isColorPickerOpen: false,
    on: false,
    color: 'rgba(255, 255, 255, 0)'
  };
  componentWillMount() {
    const {
      defaultStatus
    } = this.props;

    const isOff = defaultStatus === COLOR_MODE.OFF;

    this.state = {
      isColorPickerOpen: false,
      on: !isOff,
      color: isOff ? 'rgba(255, 255, 255, 0)' : defaultStatus
    };
    this.handleDocumentClick = e => {
      if (!e.target.contains(this._colorPickerContainer)) {
        this.toggleColorPicker(false);
      }
    };
    document.body.addEventListener('click', this.handleDocumentClick);
    document.body.addEventListener('click', this.handleDocumentClick);
  }
  componentWillUnmount() {
    document.body.removeEventListener('click', this.handleDocumentClick);
  }
  handleCheckedChange = this.handleCheckedChange.bind(this);
  handleColorChange = this.handleColorChange.bind(this);
  handleColorClick = this.handleColorClick.bind(this);
  handleCheckedChange(on) {
    if (!this.inProcess) {
      this.inProcess = true;
      const { color } = this.state;
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
  handleColorClick(e) {
    e.preventDefault();
    this.toggleColorPicker(true);
  }
  toggleColorPicker(isColorPickerOpen = !this.state.isColorPickerOpen) {
    this.setState({
      isColorPickerOpen
    });
  }
  render() {
    const { on, color, isColorPickerOpen } = this.state;
    const colorObj = Color(color);
    const colorWithoutAlpha = Color(color).alpha(1).rgbaString();
    return (
      <div
        style={{
          height: '100%'
        }}
      >
        <Switch
          checked={on}
          onCheckedChange={this.handleCheckedChange}
        >
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-around'
            }}
          >
            <LedIcon style={{ height: 'auto', width: '2.5rem', color: on ? colorWithoutAlpha : '#000' }} />
            {
              on &&
              <div
                style={{
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  backgroundColor: colorWithoutAlpha
                }}
                onClick={this.handleColorClick}
              />
            }
          </div>
        </Switch>
        { isColorPickerOpen &&
          <div
            ref={ref => { this._colorPickerContainer = ref; }}
            style={{
              position: 'absolute',
              zIndex: 1, // Becuase I'm lazy
              bottom: '20px',
              left: '20px'
            }}
          >
            <SketchPicker
              color={{ r: colorObj.red(), g: colorObj.green(), b: colorObj.blue() }}
              onChangeComplete={this.handleColorChange}
            />
          </div>
        }
      </div>
    );
  }
}
if (__DEV__) {
  Led.propTypes = {
    defaultStatus: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.oneOf([COLOR_MODE.OFF])
    ]).isRequired
  };
}
