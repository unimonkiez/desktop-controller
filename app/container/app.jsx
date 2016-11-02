import React, { Component, PropTypes } from 'react';
import Color from 'color';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Tabs from '../component/tabs.jsx';

injectTapEventPlugin(); // Needed for onTouchTap

export default class App extends Component {
  static childContextTypes = {
    style: PropTypes.object
  };
  getChildContext() {
    const { style } = this.props;

    return {
      style
    };
  }
  render() {
    const { activatedFeatures } = this.props;
    const { primary, secondary } = this.props.style;

    const primaryColor = Color(primary);
    const secondaryColor = Color(secondary);

    const theme = getMuiTheme({
      palette: {
        primary1Color: primaryColor.rgbaString(),
        primary2Color: primaryColor.darken(0.4).rgbaString(),
        accent1Color: secondaryColor.rgbaString(),
        pickerHeaderColor: primaryColor.rgbaString()
      }
    });

    return (
      <div style={{ color: secondaryColor.rgbaString() }}>
        <MuiThemeProvider muiTheme={theme}>
          <Tabs activatedFeatures={activatedFeatures} />
        </MuiThemeProvider>
      </div>
    );
  }

}
if (__DEV__) {
  App.propTypes = {
    style: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      secondary: PropTypes.string.isRequired
    }).isRequired,
    activatedFeatures: PropTypes.arrayOf(PropTypes.number).isRequired
  };
}
