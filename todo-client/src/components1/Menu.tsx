import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import React from 'react';
import { useLocation } from 'react-router-dom';
import { archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import './Menu.css';
import Auth from '../auth/Auth';
import LoginOutMenu from '../components/LoginOutMenu';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}
interface IMenuProps{
  auth: Auth
}

const appPages: AppPage[] = [
  {
    title: 'Home',
    url: '/',
    iosIcon: mailOutline,
    mdIcon: mailSharp
  },
  {
    title: 'New',
    url: '/new',
    iosIcon: paperPlaneOutline,
    mdIcon: paperPlaneSharp
  },
  {
    title: 'List',
    url: '/todos',
    iosIcon: heartOutline,
    mdIcon: heartSharp
  }
];

const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

const Menu: React.FC<IMenuProps> = (props) => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Inbox</IonListHeader>
          <IonNote>hi@ionicframework.com</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" icon={appPage.iosIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
          <LoginOutMenu auth={props.auth}/>
        </IonList>

        <IonList id="labels-list">
          <IonListHeader>Labels</IonListHeader>
          {labels.map((label, index) => (
            <IonItem lines="none" key={index}>
              <IonIcon slot="start" icon={bookmarkOutline} />
              <IonLabel>{label}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
