#!/usr/bin/env node
const path = require('path');
const express = require('express');
const controller = require('./controller.js');
const getStyleForArgs = require('./get-style-for-args.js');

const args = process.argv.slice(2);
const useWebpack = args.indexOf('-w') !== -1;

const app = express();
const PORT = useWebpack ? 8080 : 80;

const style = getStyleForArgs(args);
const activatedFeatures = controller.activatedFeatures;

controller.getInterface().then(controllerInterface => {
  const config = {
    style,
    activatedFeatures
  };
  app.get('/config', (req, res) => {
    res.json(Object.assign({}, config, {
      status: controllerInterface.status
    }));
  });

  let releasePower;
  // Press
  app.post('/power', (req, res) => {
    controllerInterface.pressPower().then(_releasePower => {
      releasePower = _releasePower;
      res.end();
    }, err => {
      throw err;
    });
  });

  // Release
  app.delete('/power', (req, res) => {
    if (releasePower) {
      releasePower().then(() => {
        res.end();
      }, err => {
        throw err;
      });
      releasePower = undefined;
    }
  });

  let releaseReset;
  // Press
  app.post('/reset', (req, res) => {
    controllerInterface.pressReset().then(_releaseReset => {
      releaseReset = _releaseReset;
      res.end();
    }, err => {
      throw err;
    });
  });

  // Release
  app.delete('/reset', (req, res) => {
    if (releaseReset) {
      releaseReset().then(() => {
        res.end();
      }, err => {
        throw err;
      });
      releaseReset = undefined;
    }
  });

  // On
  app.post('/wifi', (req, res) => {
    controllerInterface.turnOnWifi().then(() => {
      res.end();
    }, err => {
      throw err;
    });
  });

  // Off
  app.delete('/wifi', (req, res) => {
    controllerInterface.turnOffWifi().then(() => {
      res.end();
    }, err => {
      throw err;
    });
  });

  // On
  app.post('/uv', (req, res) => {
    controllerInterface.turnOnUvLight().then(() => {
      res.end();
    }, err => {
      throw err;
    });
  });

  // Off
  app.delete('/uv', (req, res) => {
    controllerInterface.turnOffUvLight().then(() => {
      res.end();
    }, err => {
      throw err;
    });
  });

  // On
  app.post('/led/:color', (req, res) => {
    const { color } = req.params;
    controllerInterface.turnOnLed(color).then(() => {
      res.end();
    }, err => {
      throw err;
    });
  });

  // set
  app.put('/led/:color', (req, res) => {
    const { color } = req.params;
    controllerInterface.setLed(color).then(() => {
      res.end();
    }, err => {
      throw err;
    });
  });

  // Off
  app.delete('/led', (req, res) => {
    controllerInterface.turnOffLed().then(() => {
      res.end();
    }, err => {
      throw err;
    });
  });

  const start = () => {
    app.listen(PORT, () => {
      console.log(`App started on port ${PORT}!`);
    });
  };
  if (useWebpack) {
    // Disabling global require so it won't require that dependency in prod
    /* eslint-disable global-require */
    const webpack = require('webpack');
    const webpackMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const getWebpackConfig = require('./get-webpack-config.js');
    /* eslint-enable global-require */

    const webpackConfig = getWebpackConfig({ isWebpackDevServer: true });
    const webpackCompiler = webpack(webpackConfig);
    const webpackDevMiddlewareInstance = webpackMiddleware(webpackCompiler,
      {
        publicPath: '',
        noInfo: false,
        quiet: false
      }
    );

    app.use(webpackDevMiddlewareInstance);
    app.use(webpackHotMiddleware(webpackCompiler));
    webpackDevMiddlewareInstance.waitUntilValid(start);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    start();
  }
}, err => {
  throw err;
});
