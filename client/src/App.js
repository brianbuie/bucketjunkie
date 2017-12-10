import React from 'react';
import { Route } from 'react-router-dom';
import routes from 'routes';
import Layout from 'components/Layout/Layout';
import FetchManager from 'components/FetchManager/FetchManager';
import Loading from 'components/Loading/Loading';
import Toast from 'components/Toast/Toast';

const App = () => (
  <div className="full-height">
    <FetchManager />
    <Loading />
    <Toast />
    <Layout />
  </div>
);

export default App;