import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, withRouter } from 'react-router-dom';
import routes from '../../routes';

class RouteUserRequired extends React.Component {
  render() {
    const {
      isAuthenticated,
      component: Component,
      ...props 
    } = this.props;
    
    return (
      <Route {...props} render={props => (
        isAuthenticated
          ? <Component {...props} />
          : <Redirect to={{ pathname: routes.login, state: { from: props.location } }} />
      )} />
    );
  }
};

const mapStateToProps = state => ({
  isAuthenticated: state.user ? true : false
});

export default withRouter(connect(
  mapStateToProps
)(RouteUserRequired));