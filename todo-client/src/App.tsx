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
import { Link, Route } from 'react-router-dom';
import Auth from './auth/Auth';
import Callback from './components/Callback';
import { EditTodo } from './components/EditTodo';
import { LogIn } from './components/LogIn';
import NewTodo from './components/NewTodo';
import { NotFound } from './components/NotFound';
import Todos from './components/Todos';
import Menu from './components1/Menu';
import Page from './pages/Page';
/* Theme variables */
import './theme/variables.css';
import Logout from './components/LoginOutMenu';
/* Core CSS required for Ionic components to work properly */
/* Basic CSS for apps built with Ionic */
/* Optional CSS utils that can be commented out */
/* Theme variables */

export interface AppProps { }

export interface AppState { }

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)
  }

  auth = new Auth()


  render() {

    return (
      <IonApp>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu auth={this.auth} />
            <IonRouterOutlet id="main">
              <Route path="/page/:name" component={Page} exact />
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
                path="/new"
                render={props => {
                  return <NewTodo auth={this.auth} />
                }
                }
              />

              <Route
                exact
                path="/todos"
                render={props => {
                  return <Todos {...props} auth={this.auth} />
                }}
              />

              <Route
                exact
                path="/todos/:todoId/edit"
                render={props => {
                  return <EditTodo {...props} auth={this.auth} />
                }}
              />
              {/* TODO ?
               <Redirect from='/' to='/welsome' /> 
              */}
              {/* <Redirect from='/' to='/todos' /> */}
              <Route component={NotFound} />
            </IonRouterOutlet>

          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
    )

  }

}