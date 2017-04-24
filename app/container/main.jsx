import React from 'react';
import PropTypes from 'prop-types';
import { Hoc as ContextHoc } from 'app/container/provider.js';
import Color from 'color';
import featurePriority from 'app/constant/feature-priority.js';
import featureComponentMap from 'app/common/feature-component-map.js';
import SmartGrid from 'app/component/smart-grid.jsx';
import Title from 'app/component/title.jsx';
import Panel from 'app/component/panel.jsx';

const renderFeature = (feature, status) => {
  const FeatureComponent = featureComponentMap[feature];
  const featureStatus = status[feature];
  return (
    <Panel key={feature}>
      <FeatureComponent defaultStatus={featureStatus} />
    </Panel>
  );
};

const Component = (
  {
    status,
    textColor,
    backgroundColor,
    activatedFeatures
  }
) => (
  <div
    style={{
      color: textColor,
      backgroundColor,
      fontFamily: 'monospace',
      position: 'absolute',
      top: '0',
      right: '0',
      bottom: '0',
      left: '0',
      display: 'flex',
      flexDirection: 'column'
    }}
  >
    <div
      style={{
        flex: '0 0'
      }}
    >
      <Title />
    </div>
    <div
      style={{
        flex: '1 1'
      }}
    >
      <SmartGrid>
        {
          featurePriority
          .filter(feature => activatedFeatures.indexOf(feature) !== -1)
          .map(feature => renderFeature(feature, status))
        }
      </SmartGrid>
    </div>
  </div>
);

if (__DEV__) {
  Component.propTypes = {
    activatedFeatures: PropTypes.arrayOf(PropTypes.number).isRequired,
    status: PropTypes.shape({}).isRequired,
    textColor: PropTypes.string,
    backgroundColor: PropTypes.string
  };
}

export default ContextHoc(ctx => ({
  textColor: Color(ctx.secondaryColor).rgbaString(),
  backgroundColor: Color(ctx.primaryColor).rgbaString()
}))(Component);
