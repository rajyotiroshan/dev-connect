import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


/**
 * 
 * @param {Component, isAuthenticated, loading} 
 * @returns Route to /login if not authenticated else passed component 
 */
const PrivateRoute = ({
  component: Component,//rename as Component
  auth: { isAuthenticated, loading },//access auth then extract both mention fied from its
  ...rest //remaining props object fields like path
}) => (
  <Route
    {...rest}
    render={props =>
      !isAuthenticated && !loading ? (
        <Redirect to='/login' />
      ) : (
        <Component {...props} />
      )
    }
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps)(PrivateRoute);
