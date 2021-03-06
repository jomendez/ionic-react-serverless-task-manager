import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/typography.css';
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Auth from './auth/Auth';
import Callback from './components/Callback';
import Home from './components/Home';
import { LogIn } from './components/LogIn';
import Menu from './components/Menu';
import NewTask from './components/NewTask';
import ProfileComponent from './components/Profile';
import Tasks from './components/TasksList';
import { UploadImage } from './components/UploadImage';
/* Theme variables */
import './theme/variables.css';
import { UploadProfileImage } from './components/UploadProfileImage';
/* Core CSS required for Ionic components to work properly */
/* Basic CSS for apps built with Ionic */
/* Optional CSS utils that can be commented out */
/* Theme variables */
/* Core CSS required for Ionic components to work properly */
/* Basic CSS for apps built with Ionic */
/* Optional CSS utils that can be commented out */
/* Theme variables */
/* Core CSS required for Ionic components to work properly */
/* Basic CSS for apps built with Ionic */
/* Optional CSS utils that can be commented out */
/* Theme variables */
/* Core CSS required for Ionic components to work properly */
/* Basic CSS for apps built with Ionic */
/* Optional CSS utils that can be commented out */
/* Theme variables */

export interface AppProps { }

export interface AppState { }

export default class App extends Component<AppProps, AppState> {
  auth = new Auth()

  render() {

    return (
      <IonApp>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu auth={this.auth} />
            <IonRouterOutlet id="main">
              <Route
                path="/callback"
                render={props => {
                  let location = props ? props.location : {};

                  return <Callback auth={this.auth} location={location} />
                }}
              />

              <Route
                exact
                path="/login"
                render={props => {
                  return <LogIn auth={this.auth} />
                }
                }
              />

              <Route
                exact
                path="/profile"
                render={props => {
                  return <ProfileComponent auth={this.auth} />
                }
                }
              />

              <Route
                exact
                path="/new"
                render={props => {
                  return <NewTask auth={this.auth} />
                }
                }
              />

              <Route
                exact
                path="/tasks"
                render={props => {
                  return <Tasks {...props} auth={this.auth} />
                }}
              />

              <Route
                exact
                path="/tasks/:taskId/edit"
                render={props => {
                  return <UploadImage {...props} auth={this.auth} />
                }}
              />

              <Route
                exact
                path="/profiles/:profileId/edit"
                render={props => {
                  return <UploadProfileImage {...props} auth={this.auth} />
                }}
              />
              <Route component={Home} />
            </IonRouterOutlet>

          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
    )

  }

}