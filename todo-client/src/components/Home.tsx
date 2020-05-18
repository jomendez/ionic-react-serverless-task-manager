import * as React from 'react'
import { IonPage, IonContent } from '@ionic/react'
import PageHeader from './PageHeader'

interface HomeProps {
  name: string;
}


const Home: React.FC<HomeProps> = (props) => {

  return (
    <IonPage>
      <PageHeader name="Home" />
      <IonContent>
        <h1 style={{ textAlign: "center", margin: "16px" }}>Welcome</h1>
      </IonContent>
    </IonPage>

  )

}

export default Home
