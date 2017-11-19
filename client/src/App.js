import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import routes from './routes';

// Layouts
import Dashboard from './layouts/Dashboard/Dashboard';



// Components
import Loading from './components/Loading/Loading';
import Menu from './components/Menu/Menu';
import Toast from './components/Toast/Toast';

const App = () => (
  <Router>
    <div className="full-height d-flex flex-column">
      <Loading />
      <Menu />
      <Toast />
      <Route path="/dash" component={Dashboard} />
    </div>
  </Router>
);

export default App;