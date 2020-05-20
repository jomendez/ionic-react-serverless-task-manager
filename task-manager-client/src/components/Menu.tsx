import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote
} from '@ionic/react';
import { bookmarkOutline, documentOutline, documentSharp, heartOutline, heartSharp, homeOutline, homeSharp, listOutline, listSharp, personOutline, personSharp } from 'ionicons/icons';
import React from 'react';
import { useLocation } from 'react-router-dom';
import Auth from '../auth/Auth';
import LoginOutMenu from './LoginOutMenu';
import './Menu.css';


interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}
interface IMenuProps {
  auth: Auth
}

const appPages: AppPage[] = [
  {
    title: 'Home',
    url: '/',
    iosIcon: homeOutline,
    mdIcon: homeSharp
  },
  {
    title: 'New',
    url: '/new',
    iosIcon: documentOutline,
    mdIcon: documentSharp
  },
  {
    title: 'List',
    url: '/tasks',
    iosIcon: listOutline,
    mdIcon: listSharp
  },
  {
    title: 'Profile',
    url: '/profile',
    iosIcon: personOutline,
    mdIcon: personSharp
  }
];

const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

const Menu: React.FC<IMenuProps> = (props) => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Task Manager</IonListHeader>
          <IonNote>Howdy Guess</IonNote>
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
          <LoginOutMenu auth={props.auth} />
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
