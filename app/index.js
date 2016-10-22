import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './container/app.jsx';
import getConfig from './common/get-config.js';

window.onload = () => {
  document.body.style.margin = 0;
  getConfig.then(config => {
    document.body.style['background-color'] = config.style.primary;

    const div = document.getElementById('app');
    ReactDOM.render(React.createElement(App, config), div);
  }, err => {
    document.write(err);
    throw err;
  });
};
