import React from 'react';
import { Redirect } from 'react-router';
import { Dimmer, Loader } from 'semantic-ui-react';
import Auth from '../auth/Auth';


interface CallbackProps {
  auth: Auth
  location: any
}

// function Callback(props: any) {
class Callback extends React.PureComponent<CallbackProps, any> {

  state = {
    redirect: false
  }

  
  async componentDidMount() {
    const { auth, location } = this.props;
    if (/access_token|id_token|error/.test(location.hash)) {
      auth.handleAuthentication()
        .then((e: any) => {
          if (auth.isAuthenticated()) {
            this.setState({ redirect: true })
          }
        })
    }
  }

  // props.auth.isAuthenticated()
  render() {

    if (this.state.redirect && this.props.auth.isAuthenticated()) {
      return (
        <Redirect to='/tasks' />
      )
    } else {
      return (
        <>
          <Dimmer active>
            <Loader content="Loading" />
          </Dimmer>
        </>
      )
    }
  }
}


export default Callback
