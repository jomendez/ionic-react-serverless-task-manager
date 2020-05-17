import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile } from '../api/todos-api'
import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/react'
import Loading from './Loading'
import { Redirect } from 'react-router'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditTodoProps {
  match: {
    params: {
      todoId: string
    }
  }
  auth: Auth
}

interface EditTodoState {
  file: any
  uploadState: UploadState
  doneUpload: boolean
}

export class EditTodo extends React.PureComponent<
  EditTodoProps,
  EditTodoState
  > {
  state: EditTodoState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    doneUpload: false
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.todoId)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      this.setState({
        doneUpload: true
      });

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    if (this.state.doneUpload) {
      return (
        <Redirect to='/todo' />
      )
    }
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Login</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Upload new image</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {this.renderLoading()}
              <Form onSubmit={this.handleSubmit}>
                <Form.Field>
                  <label>File</label>
                  <input
                    type="file"
                    accept="image/*"
                    placeholder="Image to upload"
                    onChange={this.handleFileChange}
                  />
                </Form.Field>

                {this.renderButton()}
              </Form>

            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    )
  }

  renderLoading() {
    if (this.state.uploadState === UploadState.FetchingPresignedUrl || this.state.uploadState === UploadState.UploadingFile) {
      return <Loading />
    }
  }

  renderButton() {
    return (
      <IonButton expand="full"
        type="submit"
      >
        Upload
      </IonButton>
    )
  }
}
