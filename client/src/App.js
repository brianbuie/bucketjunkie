import React from 'react';
import { Route } from 'react-router-dom';
import routes from 'routes';

// Layouts
import Layout from 'components/Layout/Layout';

// Components
import RouteUserRequired from 'components/Auth/RouteUserRequired';
import Loading from 'components/Loading/Loading';
import Menu from 'components/Menu/Menu';
import Toast from 'components/Toast/Toast';

const App = () => (
  <div className="full-height">
    <Loading />
    <Toast />
    <Layout />
  </div>
);

export default App;