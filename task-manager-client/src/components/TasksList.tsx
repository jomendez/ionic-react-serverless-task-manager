import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCheckbox, IonContent, IonDatetime, IonFab, IonFabButton, IonIcon, IonItem, IonLabel, IonPage, IonRefresher, IonRefresherContent, withIonLifeCycle, IonToast } from '@ionic/react'
import dateFormat from 'dateformat'
import update from 'immutability-helper'
import { add, chevronDownCircleOutline } from 'ionicons/icons'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { Image } from 'semantic-ui-react'
import { deleteTask, getTasks, patchTask } from '../api/task-api'
import Auth from '../auth/Auth'
import { Task } from '../types/Task'
import AuthenticationCheck from './Authenticated'
import Loading from './Loading'
import PageHeader from './PageHeader'


interface TasksProps {
  auth: Auth
}

interface TasksState {
  tasks: Task[]
  newTaskName: string
  loadingTasks: boolean
  isToastOpen: boolean
  tosatMessage: string
  toastDuration: number

}

class Tasks extends React.PureComponent<TasksProps, TasksState> {
  state: TasksState = {
    tasks: [],
    newTaskName: '',
    loadingTasks: false,
    isToastOpen: false,
    tosatMessage: '',
    toastDuration: 2000
  }

  onTaskDelete = async (taskId: string) => {
    try {
      await deleteTask(this.props.auth.getIdToken(), taskId)
      this.setState({
        tasks: this.state.tasks.filter(task => task.todoId !== taskId)
      })
    } catch {
      this.setState({
        isToastOpen: true,
        tosatMessage: 'Task deletion failed'
      })
    }
  }

  onTaskCheck = async (pos: number) => {
    try {
      const task = this.state.tasks[pos]
      await patchTask(this.props.auth.getIdToken(), task.todoId, {
        name: task.name,
        text: task.text,
        dueDate: task.dueDate,
        done: !task.done
      })
      this.setState({
        tasks: update(this.state.tasks, {
          [pos]: { done: { $set: !task.done } }
        })
      })
    } catch {
      this.setState({
        isToastOpen: true,
        tosatMessage: 'Task deletion failed'
      })
    }
  }

  onImageError(ev: any) {
    ev.target.src = 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
  }

  async loadContent(event: any = null) {
    this.setState({
      tasks: [],
      loadingTasks: true
    })
    if (!this.props.auth.isAuthenticated()) {
      return
    }
    try {
      const tasks = await getTasks(this.props.auth.getIdToken())
      this.setState({
        tasks,
        loadingTasks: false
      })
      event?.detail?.complete();
    } catch (e) {
      event?.detail?.complete();
      this.setState({
        isToastOpen: true,
        tosatMessage: `Failed to fetch tasks: ${e.message}`
      })
    }
  }

  async onSaveDuedate(pos: number) {
    try {
      const task = { ... this.state.tasks[pos] };//clone object

      task.dueDate = dateFormat(task.dueDate, 'yyyy-mm-dd') as string

      await patchTask(this.props.auth.getIdToken(), task.todoId, {
        name: task.name,
        text: task.text,
        dueDate: task.dueDate,
        done: task.done
      });
    } catch {
      this.setState({
        isToastOpen: true,
        tosatMessage: 'Task deletion failed'
      })
    }
  }

  setSelectedDate(ev: string, pos: number) {

    const task = { ... this.state.tasks[pos] };//clone object
    const date = new Date(ev);
    task.dueDate = dateFormat(date, 'yyyy-mm-dd') as string

    this.setState({
      tasks: update(this.state.tasks, {
        [pos]: { dueDate: { $set: task.dueDate } }
      })
    });
  }

  async ionViewDidEnter() {
    this.loadContent();
  }

  ionViewWillLeave() {
    this.setState({
      loadingTasks: false
    })
  }

  render() {


    return (
      <>
        <AuthenticationCheck auth={this.props.auth} />
        {this.main()}
      </>
    )

  }

  main() {
    return (
      <IonPage>
        <PageHeader name="List of tasks" />
        <IonContent>
          <IonToast
            isOpen={this.state.isToastOpen}
            message={this.state.tosatMessage}
            duration={this.state.toastDuration}
          />
          {this.renderRefresher()}
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <Link to="/new">
              <IonFabButton>
                <IonIcon icon={add} />
              </IonFabButton>
            </Link>
          </IonFab>
        </IonContent>
      </IonPage>

    )
  }

  renderRefresher() {
    return (
      <>
        <IonRefresher slot="fixed" onIonRefresh={(e) => this.loadContent(e)}>
          <IonRefresherContent
            pullingIcon={chevronDownCircleOutline}
            pullingText="Pull to refresh"
            refreshingSpinner="circles"
            refreshingText="Refreshing...">
          </IonRefresherContent>
        </IonRefresher>
        {this.renderTasks()}
      </>
    )
  }

  renderTasks() {
    if (this.state.loadingTasks) {
      return <Loading />
    }

    return this.renderTasksList()
  }

  renderTasksList() {
    return (
      <div>
        {this.state.tasks.map((task, pos) => {
          return (
            <IonCard key={task.todoId}>
              <IonCardHeader>
                <IonCardTitle>{task.name}</IonCardTitle>
              </IonCardHeader>

              <IonCardContent>

                {task.attachmentUrl && (
                  <Image wrapped src={task.attachmentUrl} />
                )}
                <IonItem>
                  <IonLabel>Done</IonLabel>
                  <IonCheckbox
                    slot="start" color="primary"
                    onIonChange={() => this.onTaskCheck(pos)}
                    checked={task.done}
                  />

                </IonItem>

                <IonItem>
                  <IonLabel>{task.text}</IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>Due date</IonLabel>
                  <IonDatetime pickerOptions={{
                    buttons: [
                      {
                        text: 'Save',
                        handler: (e) => {
                          const day = e.day.text;
                          const month = e.month.text;
                          const year = e.year.text;
                          const task = { ... this.state.tasks[pos] };//clone object
                          const date = new Date(`${month}-${day}-${year}`);
                          task.dueDate = dateFormat(date, 'yyyy-mm-dd') as string

                          this.setState({
                            tasks: update(this.state.tasks, {
                              [pos]: { dueDate: { $set: task.dueDate } }
                            })
                          });
                          this.onSaveDuedate(pos);
                        }
                      }, {
                        text: 'Cancel',
                        handler: () => {
                          console.log('Clicked cancel, dismiss.');
                          return true;
                        }
                      }
                    ]
                  }}
                    displayFormat="MM-DD-YYYY" placeholder="Select Date" value={task.dueDate} ></IonDatetime>
                </IonItem>

                <Link to={`/tasks/${task.todoId}/edit`}>
                  <IonButton color="primary">Upload Image</IonButton>
                </Link>
                <IonButton onClick={() => { this.onTaskDelete(task.todoId) }} color="danger">Delete</IonButton>

              </IonCardContent>
            </IonCard>
          )
        })}
      </div>
    )
  }

}

export default withIonLifeCycle(Tasks)