import React, { Component, PropTypes } from 'react';
import Color from 'color';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Main from 'app/container/main.jsx';
import Provider from 'app/container/provider.js';

injectTapEventPlugin(); // Needed for onTouchTap

export default class App extends Component {
  render() {
    const { activatedFeatures } = this.props;
    const { primary, secondary } = this.props.style;

    const primaryColor = Color(primary);
    const secondaryColor = Color(secondary);

    const theme = getMuiTheme({
      palette: {
        primary1Color: secondaryColor.rgbaString(),
        primary2Color: secondaryColor.darken(0.4).rgbaString(),
        accent1Color: secondaryColor.rgbaString(),
        pickerHeaderColor: primaryColor.rgbaString()
      }
    });

    return (
      <Provider
        primaryColor={primary}
        secondaryColor={secondary}
      >
        <MuiThemeProvider muiTheme={theme}>
          <Main
            activatedFeatures={activatedFeatures}
          />
        </MuiThemeProvider>
      </Provider>
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
