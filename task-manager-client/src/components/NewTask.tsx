import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonInput, IonItem, IonLabel, IonPage, IonTextarea, IonToast } from '@ionic/react';
import dateFormat from 'dateformat';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { createTask } from '../api/task-api';
import Auth from '../auth/Auth';
import { Task } from '../types/Task';
import AuthenticationCheck from './Authenticated';
import PageHeader from './PageHeader';

export interface INewTaskProps {
  auth: Auth
}

interface TasksState {
  tasks: Task[]
  newTaskName: string
  newTaskText: string
  loadingTasks: boolean
  isToastOpen: boolean
  tosatMessage: string
  toastDuration: number
}

export default class NewTask extends React.Component<INewTaskProps> {
  state: TasksState = {
    tasks: [],
    newTaskName: '',
    newTaskText: '',
    loadingTasks: true,

    isToastOpen: false,
    tosatMessage: '',
    toastDuration: 2000
  }

  handleNameChange = (event: CustomEvent<KeyboardEvent>) => {
    const val = (event.target as HTMLInputElement).value
    this.setState({ newTaskName: val })
  }

  handleTextChange = (event: CustomEvent<KeyboardEvent>) => {
    const val = (event.target as HTMLInputElement).value
    this.setState({ newTaskText: val })
  }


  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }

  onTaskCreate = async () => {
    if (!this.state.newTaskName) {
      this.setState({
        isToastOpen: true,
        tosatMessage: 'Enter the task name'
      })
      return
    }
    try {
      const dueDate = this.calculateDueDate()
      const newTask = await createTask(this.props.auth.getIdToken(), {
        name: this.state.newTaskName,
        text: this.state.newTaskText,
        dueDate
      })
      this.setState({
        tasks: [...this.state.tasks, newTask],
        newTaskName: '',
        newTaskText: ''
      })
    } catch {
      this.setState({
        isToastOpen: true,
        tosatMessage: 'Task creation failed'
      })
    }
  }

  public render() {

    return (
      <>
        <AuthenticationCheck auth={this.props.auth} />
        <IonPage>
          <PageHeader name="New Task" />
          <IonContent>
            <IonToast
              isOpen={this.state.isToastOpen}
              message={this.state.tosatMessage}
              duration={this.state.toastDuration}
            />
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>New</IonCardTitle>
              </IonCardHeader>

              <IonCardContent>
                <IonItem>
                  <IonLabel position="floating">Enter Name</IonLabel>
                  <IonInput value={this.state.newTaskName} onIonInput={this.handleNameChange}></IonInput>
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Enter the task ro change the world...</IonLabel>
                  <IonTextarea value={this.state.newTaskText} onIonInput={this.handleTextChange}></IonTextarea>
                </IonItem>

                <IonButton onClick={() => { this.onTaskCreate() }} color="primary">New Task</IonButton>
                <Link to="/tasks" className="btn btn-primary">
                  <IonButton color="secondary">
                    List of Tasks

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
