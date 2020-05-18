import * as React from 'react';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle } from '@ionic/react';

interface IPageHeaderProps {
  name: string;
}

const PageHeader: React.FunctionComponent<IPageHeaderProps> = (props) => {
  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuButton />
        </IonButtons>
        <IonTitle>{props.name}</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default PageHeader;
