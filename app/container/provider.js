import createProviderAndHoc from 'app/higher-order-component/context/create-provider-and-hoc.js';
import { PropTypes } from 'react';
import Color from 'color';

const {
  Provider,
  Hoc: _Hoc
} = createProviderAndHoc({
  primaryColor: PropTypes.instanceOf(Color),
  secondaryColor: PropTypes.instanceOf(Color)
});

export default Provider;
export const Hoc = _Hoc;
