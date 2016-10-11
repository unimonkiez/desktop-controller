import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './container/app.jsx';

window.onload = () => {
  const div = document.getElementById('app');
  ReactDOM.render(React.createElement(App, {}), div);
};
