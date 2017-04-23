import createProviderAndHoc from 'app/higher-order-component/context/create-provider-and-hoc.js';
import { PropTypes } from 'react';

const {
  Provider,
  Hoc: _Hoc
} = createProviderAndHoc({
  primaryColor: PropTypes.string,
  secondaryColor: PropTypes.string
});

export default Provider;
export const Hoc = _Hoc;
