import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuth } from './helpers';

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        isAuth() && isAuth().role === 'admin' ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/signin',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
