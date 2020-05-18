import * as React from 'react';
import Auth from '../auth/Auth';
import { Redirect } from 'react-router';

interface IAuthenticationCheckProps {
  auth: Auth
}

const AuthenticationCheck: React.FunctionComponent<IAuthenticationCheckProps> = (props) => {

  const isAuthenticated = props.auth.isAuthenticated();
  if (!isAuthenticated) {
    return (
      <Redirect to='/login' />
    )
  } else {
    return (
      <>
      </>
    )
  }
};

export default AuthenticationCheck;
