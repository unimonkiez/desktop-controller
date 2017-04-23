import { FEATURES } from 'lib/constant.js';
import Power from 'app/container/power.jsx';
import Reset from 'app/container/reset.jsx';
import UvLight from 'app/container/uv-light.jsx';
import Led from 'app/container/led.jsx';
import Wifi from 'app/container/wifi.jsx';

export default {
  [FEATURES.POWER]: Power,
  [FEATURES.RESET]: Reset,
  [FEATURES.WIFI]: Wifi,
  [FEATURES.LED]: Led,
  [FEATURES.UV]: UvLight
};
