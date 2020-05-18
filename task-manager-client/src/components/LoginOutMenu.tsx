import * as React from 'react';
import Auth from '../auth/Auth';
import { IonMenuToggle, IonItem, IonIcon, IonLabel } from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';

interface ILoginOutMenuProps {
  auth: Auth
}

const LoginOutMenu: React.FunctionComponent<ILoginOutMenuProps> = (props) => {

  const onAuthenticationHandler = () => {
    if (props.auth.isAuthenticated()) {
      props.auth.logout();
    } else {
      props.auth.login()
    }
  }

  return (
    <IonMenuToggle autoHide={false}>
      <IonItem routerDirection="none" lines="none" detail={false}>
        <IonIcon slot="start" icon={logOutOutline} />
        <IonLabel onClick={onAuthenticationHandler}>{props.auth.isAuthenticated() ? 'Log Out' : 'Log in'}</IonLabel>
      </IonItem>
    </IonMenuToggle>
  )



};

export default LoginOutMenu;
