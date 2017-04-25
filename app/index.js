import 'babel-polyfill';
import disableScroll from 'app/common/disable-scroll.js';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './container/app.jsx';
import getConfig from './common/get-config.js';

window.onload = () => {
  document.body.style.margin = 0;
  document.body.style.overflow = 'hidden';
  disableScroll();

  getConfig.then(config => {
    document.body.style['background-color'] = config.style.primary;

    const div = document.getElementById('app');
    ReactDOM.render(React.createElement(App, config), div);
  }, err => {
    document.write(err);
    throw err;
  });
};
