import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCheckbox, IonContent, IonDatetime, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonLabel, IonMenuButton, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToolbar, withIonLifeCycle } from '@ionic/react'
import dateFormat from 'dateformat'
import update from 'immutability-helper'
import { add, chevronDownCircleOutline } from 'ionicons/icons'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { Image } from 'semantic-ui-react'
import { deleteTodo, getTodos, patchTodo } from '../api/todos-api'
import Auth from '../auth/Auth'
import { Todo } from '../types/Todo'
import AuthenticationCheck from './Authenticated'
import Loading from './Loading'


interface TodosProps {
  auth: Auth
}

interface TodosState {
  todos: Todo[]
  newTodoName: string
  loadingTodos: boolean
}

class Todos extends React.PureComponent<TodosProps, TodosState> {
  state: TodosState = {
    todos: [],
    newTodoName: '',
    loadingTodos: false
  }

  onTodoDelete = async (todoId: string) => {
    try {
      await deleteTodo(this.props.auth.getIdToken(), todoId)
      this.setState({
        todos: this.state.todos.filter(todo => todo.todoId !== todoId)
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  onTodoCheck = async (pos: number) => {
    try {
      const todo = this.state.todos[pos]
      await patchTodo(this.props.auth.getIdToken(), todo.todoId, {
        name: todo.name,
        text: todo.text,
        dueDate: todo.dueDate,
        done: !todo.done
      })
      this.setState({
        todos: update(this.state.todos, {
          [pos]: { done: { $set: !todo.done } }
        })
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  onImageError(ev: any) {
    ev.target.src = 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
  }

  async loadContent(event: any = null) {
    this.setState({
      todos: [],
      loadingTodos: true
    })
    if (!this.props.auth.isAuthenticated()) {
      return
    }
    try {
      const todos = await getTodos(this.props.auth.getIdToken())
      this.setState({
        todos,
        loadingTodos: false
      })
      event?.detail?.complete();
    } catch (e) {
      event?.detail?.complete();
      alert(`Failed to fetch todos: ${e.message}`)
    }
  }

  async onSaveDuedate(pos: number) {
    try {
      const todo = { ... this.state.todos[pos] };//clone object

      todo.dueDate = dateFormat(todo.dueDate, 'yyyy-mm-dd') as string

      await patchTodo(this.props.auth.getIdToken(), todo.todoId, {
        name: todo.name,
        text: todo.text,
        dueDate: todo.dueDate,
        done: todo.done
      });
    } catch {
      alert('Todo deletion failed')
    }
  }

  setSelectedDate(ev: string, pos: number) {

    const todo = { ... this.state.todos[pos] };//clone object
    const date = new Date(ev);
    todo.dueDate = dateFormat(date, 'yyyy-mm-dd') as string

    this.setState({
      todos: update(this.state.todos, {
        [pos]: { dueDate: { $set: todo.dueDate } }
      })
    });
  }

  async ionViewDidEnter() {
    this.loadContent();

  }

  render() {


    return (
      <>
        <AuthenticationCheck auth={this.props.auth} />
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonMenuButton />
              </IonButtons>
              <IonTitle>List of Tasks</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
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
      </>
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
        {this.renderTodos()}
      </>
    )
  }

  renderTodos() {
    if (this.state.loadingTodos) {
      return <Loading />
    }

    return this.renderTodosList()
  }

  renderTodosList() {
    return (
      <div>
        {this.state.todos.map((todo, pos) => {
          return (
            <IonCard key={todo.todoId}>
              <IonCardHeader>
                <IonCardTitle>{todo.name}</IonCardTitle>
              </IonCardHeader>

              <IonCardContent>

                {todo.attachmentUrl && (
                  <Image wrapped src={todo.attachmentUrl} />
                )}
                <IonItem>
                  <IonLabel>Done</IonLabel>
                  <IonCheckbox
                    slot="start" color="primary"
                    onIonChange={() => this.onTodoCheck(pos)}
                    checked={todo.done}
                  />

                </IonItem>

                <IonItem>
                  <IonLabel>{todo.text}</IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>Due date</IonLabel>
                  <IonDatetime pickerOptions={{
                    buttons: [
                      {
                        text: 'Save',
                        handler: () => {
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
                    displayFormat="MM-DD-YYYY" placeholder="Select Date" value={todo.dueDate} onIonChange={e => this.setSelectedDate(e.detail.value!, pos)}></IonDatetime>
                </IonItem>

                <Link to={`/todos/${todo.todoId}/edit`}>
                  <IonButton color="primary">Edit</IonButton>
                </Link>
                <IonButton onClick={() => { this.onTodoDelete(todo.todoId) }} color="danger">Delete</IonButton>

              </IonCardContent>
            </IonCard>
          )
        })}
      </div>
    )
  }

}

export default withIonLifeCycle(Todos)