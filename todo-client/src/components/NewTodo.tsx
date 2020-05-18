import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonTextarea } from '@ionic/react';
import dateFormat from 'dateformat';
import * as React from 'react';
import { Redirect, useHistory } from 'react-router';
import { createTodo } from '../api/todos-api';
import Auth from '../auth/Auth';
import { Todo } from '../types/Todo';
import { Link } from 'react-router-dom';
import AuthenticationCheck from './Authenticated';

export interface INewTodoProps {
  auth: Auth
}

interface TodosState {
  todos: Todo[]
  newTodoName: string
  newTodoText: string
  loadingTodos: boolean
}

export default class NewTodo extends React.Component<INewTodoProps> {
  state: TodosState = {
    todos: [],
    newTodoName: '',
    newTodoText: '',
    loadingTodos: true
  }

  handleNameChange = (event: CustomEvent<KeyboardEvent>) => {
    const val = (event.target as HTMLInputElement).value
    this.setState({ newTodoName: val })
  }

  handleTextChange = (event: CustomEvent<KeyboardEvent>) => {
    const val = (event.target as HTMLInputElement).value
    this.setState({ newTodoText: val })
  }


  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }

  onTodoCreate = async () => {
    if (!this.state.newTodoName) {
      alert('Enter the task name');
      return
    }
    try {
      const dueDate = this.calculateDueDate()
      const newTodo = await createTodo(this.props.auth.getIdToken(), {
        name: this.state.newTodoName,
        text: this.state.newTodoText,
        dueDate
      })
      this.setState({
        todos: [...this.state.todos, newTodo],
        newTodoName: '',
        newTodoText: ''
      })
    } catch {
      alert('Todo creation failed')
    }
  }

  public render() {

    return (
      <>
        <AuthenticationCheck auth={this.props.auth} />
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonMenuButton />
              </IonButtons>
              <IonTitle>New Todo</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>

            <IonCard>
              <IonCardHeader>
                <IonCardTitle>New</IonCardTitle>
              </IonCardHeader>

              <IonCardContent>
                <IonItem>
                  <IonLabel position="floating">Enter Name</IonLabel>
                  <IonInput value={this.state.newTodoName} onIonInput={this.handleNameChange}></IonInput>
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">To change the world...</IonLabel>
                  <IonTextarea value={this.state.newTodoText} onIonInput={this.handleTextChange}></IonTextarea>
                </IonItem>

                <IonButton onClick={() => { this.onTodoCreate() }} color="primary">New Task</IonButton>
                <Link to="/todos" className="btn btn-primary">
                  <IonButton color="secondary">
                    List of TODOs

                  </IonButton>
                </Link>
              </IonCardContent>
            </IonCard>
          </IonContent>
        </IonPage>
      </>
    );

  }
}
