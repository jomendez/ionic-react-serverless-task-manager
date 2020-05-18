import * as React from 'react'
import Auth from '../auth/Auth'
import { Button } from 'semantic-ui-react'
import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonButton } from '@ionic/react'
import PageHeader from './PageHeader'

interface LogInProps {
  auth: Auth
}

interface LogInState { }

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <IonPage>
        <PageHeader name="Login" />
        <IonContent>

          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Please Login</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <IonButton expand="full" onClick={() => { this.onLogin() }} color="primary">Log in</IonButton>

            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
  
    )
  }
}
