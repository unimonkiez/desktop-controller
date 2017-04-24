import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Color from 'color';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Main from 'app/container/main.jsx';
import Provider from 'app/container/provider.js';

injectTapEventPlugin(); // Needed for onTouchTap

export default class App extends Component {
  render() {
    const { style, ...otherProps } = this.props;
    const { primary, secondary } = style;

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
          <Main {...otherProps} />
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
    }).isRequired
  };
}
