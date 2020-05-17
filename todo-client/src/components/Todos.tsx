import update from 'immutability-helper'
import * as React from 'react'
import { Redirect } from 'react-router'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,

  Image,
  Loader
} from 'semantic-ui-react'
import { deleteTodo, getTodos, patchTodo } from '../api/todos-api'
import Auth from '../auth/Auth'
import { Todo } from '../types/Todo'
import NewTodo from './NewTodo'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonCheckbox, IonButton, IonLoading, IonButtons, IonMenuButton } from '@ionic/react'
import { Link } from 'react-router-dom'
import Loading from './Loading'


interface TodosProps {
  auth: Auth
}

interface TodosState {
  todos: Todo[]
  newTodoName: string
  loadingTodos: boolean
}

export class Todos extends React.PureComponent<TodosProps, TodosState> {
  state: TodosState = {
    todos: [],
    newTodoName: '',
    loadingTodos: true
  }


  onEditButtonClick = (todoId: string) => {
    // TODO: navigate to edit 
    //this.props.history.push(`/todos/${todoId}/edit`)
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

  async componentDidMount() {

    if (!this.props.auth.isAuthenticated()) {
      this.setState({
        todos: [],
        loadingTodos: false
      })
      return
    }
    try {
      const todos = await getTodos(this.props.auth.getIdToken())
      this.setState({
        todos,
        loadingTodos: false
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${e.message}`)
    }
  }

  render() {

    // if (!this.props.auth.isAuthenticated()) {
    //   return <Redirect to='/login' />
    // } else {
    const isAuthenticated = this.props.auth.isAuthenticated();
    if (!isAuthenticated) {
      return (
        <Redirect to='/login' />
      )
    } else {

      return (
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
            {this.renderTodos()}
          </IonContent>
        </IonPage>
      )
    }
  }


  renderTodos() {
    if (this.state.loadingTodos) {
      return <Loading />
    }

    return this.renderTodosList()
  }

  onImageError(ev: any) {
    ev.target.onerror = null;
    ev.target.src = 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
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
                  <Image wrapped src={todo.attachmentUrl} onError={this.onImageError} />
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
                  <IonLabel>{todo.name}</IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>{todo.dueDate}</IonLabel>
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
