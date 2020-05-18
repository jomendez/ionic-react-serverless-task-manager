import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonPage, IonToast } from '@ionic/react'
import * as React from 'react'
import { Redirect } from 'react-router'
import { Form } from 'semantic-ui-react'
import { getUploadUrl, uploadFile } from '../api/task-api'
import Auth from '../auth/Auth'
import AuthenticationCheck from './Authenticated'
import Loading from './Loading'
import PageHeader from './PageHeader'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface UploadImageProps {
  match: {
    params: {
      taskId: string
    }
  }
  auth: Auth
}

interface UploadImageState {
  file: any
  fileUrl: string
  uploadState: UploadState
  doneUpload: boolean
  isToastOpen: boolean
  tosatMessage: string
  toastDuration: number
}

export class UploadImage extends React.PureComponent<
  UploadImageProps,
  UploadImageState
  > {
  state: UploadImageState = {
    file: undefined,
    fileUrl: '',
    uploadState: UploadState.NoUpload,
    doneUpload: false,

    isToastOpen: false,
    tosatMessage: '',
    toastDuration: 2000
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0],
      fileUrl: URL.createObjectURL(files[0])
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        this.setState({
          isToastOpen: true,
          tosatMessage: 'File should be selected'
        })
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.taskId)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      this.setState({
        doneUpload: true
      });

      this.setState({
        isToastOpen: true,
        tosatMessage: 'File was uploaded!'
      })
    } catch (e) {
      this.setState({
        isToastOpen: true,
        tosatMessage: 'Could not upload a file: ' + e.message
      })
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
        <Redirect to='/tasks' />
      )
    }
    return (
      <>
        <AuthenticationCheck auth={this.props.auth} />
        <IonPage>
          <PageHeader name="Upload Image" />
          <IonContent>
            <IonToast
              isOpen={this.state.isToastOpen}
              message={this.state.tosatMessage}
              duration={this.state.toastDuration}
            />
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
                      id="file"
                      type="file"
                      accept="image/*"
                      placeholder="Image to upload"
                      onChange={this.handleFileChange}
                    />
                    <img style={{ marginTop: '16px' }} src={this.state.fileUrl} />
                  </Form.Field>

                  {this.renderButton()}
                </Form>

              </IonCardContent>
            </IonCard>
          </IonContent>
        </IonPage>
      </>
    )
  }

  renderLoading() {
    if (this.state.uploadState === UploadState.FetchingPresignedUrl || this.state.uploadState === UploadState.UploadingFile) {
      return <Loading />
    }
  }

  renderButton() {
    return (
      <IonButton expand="full" style={{ marginTop: '32px' }}
        type="submit"
      >
        Upload
      </IonButton>
    )
  }
}
