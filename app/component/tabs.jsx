import React, { Component } from 'react';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import PowerIcon from 'material-ui/svg-icons/action/power-settings-new';
import LightIcon from 'material-ui/svg-icons/action/invert-colors';
import WifiIcon from 'material-ui/svg-icons/action/settings-input-antenna';
import UpdateIcon from 'material-ui/svg-icons/action/autorenew';
import Tab from './tab.jsx';
import Power from './power.jsx';
import Reset from './reset.jsx';
import UvLight from './uv-light.jsx';
import Led from './led.jsx';
import Wifi from './wifi.jsx';
import Update from './update.jsx';

export default class Tabs extends Component {
  state = {
    selectedTabIndex: 0
  };
  handleSelectBottomNavigationItem = this.handleSelectBottomNavigationItem.bind(this);
  handleSelectBottomNavigationItem(selectedTabIndex) {
    this.setState({ selectedTabIndex });
  }
  render() {
    const tabs = [
      {
        label: 'Power',
        icon: <PowerIcon />,
        features: [
          Power,
          Reset
        ]
      },
      {
        label: 'Light',
        icon: <LightIcon />,
        features: [
          UvLight,
          Led
        ]
      },
      {
        label: 'Wifi',
        icon: <WifiIcon />,
        features: [
          Wifi
        ]
      },
      {
        label: 'Update',
        icon: <UpdateIcon />,
        features: [
          Update
        ]
      }
    ];
    const { selectedTabIndex } = this.state;
    const tab = tabs[selectedTabIndex];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', height: '100%', width: '100%' }}>
        <div style={{ flex: '1 1 auto', overflowY: 'auto' }}>
          <Tab
            label={tab.label}
            features={tab.features}
          />
        </div>
        <BottomNavigation selectedIndex={selectedTabIndex}>
          {
            tabs.map(({ label, icon }, i) => (
              <BottomNavigationItem
                key={i}
                label={label}
                icon={icon}
                onTouchTap={() => this.handleSelectBottomNavigationItem(i)}
              />
            ))
          }
        </BottomNavigation>
      </div>
    );
  }
}