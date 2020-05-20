import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonItem, IonLabel, IonPage, IonInput, IonTextarea } from '@ionic/react';
import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Image } from 'semantic-ui-react';
import { getProfiles, deleteProfile, createProfile, patchProfile } from '../api/profile-api';
import Auth from '../auth/Auth';
import PageHeader from './PageHeader';
import { Profile } from '../types/Profile';
import AuthenticationCheck from './Authenticated';

export interface IProfileProps {
  auth: Auth
}

export default function ProfileComponent(props: IProfileProps) {

  const [profile, setProfile] = React.useState<Profile>();
  const [loadingProfiles, setLoadingProfiles] = React.useState(true);

  const [newUserName, setNewUserName] = React.useState('');
  const [newDescription, setNewDescription] = React.useState('');


  const [isEditing, setIsEditing] = React.useState<boolean>();

  async function loadProfiles() {
    try {
      const profile = await getProfiles(props.auth.getIdToken());
      if (profile) {
        setProfile(profile);
      }
      setLoadingProfiles(false)

    } catch (e) {
      alert(`Failed to fetch profiles: ${e.message}`);
    }
  }


  React.useEffect(() => {
    loadProfiles();
  }, []);

  const onProfileDelete = async (profileId: string) => {
    try {
      await deleteProfile(props.auth.getIdToken(), profileId);
      setProfile(undefined);
    } catch {
      alert('Profile deletion failed');
    }
  }

  const onTaskCreate = async () => {
    if (!newUserName) {
      alert('enter user name')
      return
    }

    let profileTem = { ...profile } as Profile;
    try {
      if (isEditing) {
        await patchProfile(props.auth.getIdToken(), profile?.profileId || '', {
          userName: newUserName,
          description: newDescription
        });
        profileTem.userName = newUserName;
        profileTem.description = newDescription;
        setProfile(profileTem);
        setIsEditing(false);
      } else {
        profileTem = await createProfile(props.auth.getIdToken(), {
          userName: newUserName,
          description: newDescription
        })
        setProfile(profileTem)
      }
    } catch {
      alert('Profile creation failed');
    }
  }

  const onEdit = () => {
    setNewUserName(profile?.userName || '')
    setNewDescription(profile?.description || '')
    setIsEditing(true);
  }

  const renderButtons = () => {
    if (isEditing) {
      return (
        <IonButton onClick={() => { onTaskCreate() }} color="primary">Save Profile</IonButton>
      )
    } else {
      return (
        <IonButton onClick={() => { onTaskCreate() }} color="primary">Create Profile</IonButton>
      )
    }
  }

  const newProfileCard = () => {

    return (
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{isEditing ? 'Edit' : 'New'}</IonCardTitle>
        </IonCardHeader>

        <IonCardContent>
          <IonItem>
            <IonLabel position="floating">Enter User Name</IonLabel>
            <IonInput value={newUserName} onIonInput={(ev: any) => { setNewUserName(ev.target.value || '') }}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Enter Description</IonLabel>
            <IonTextarea value={newDescription} onIonInput={(ev: any) => setNewDescription(ev.target.value || '')}></IonTextarea>
          </IonItem>

          {renderButtons()}
        </IonCardContent>
      </IonCard>
    )
  }

  const card = () => {
    if (isEditing) {
      return (
        <>
          {newProfileCard()}
        </>
      )
    } else
      if (profile && !isEditing) {
        return (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{profile.userName}</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>

              {profile?.attachmentUrl && (
                <Image wrapped src={profile.attachmentUrl} />
              )}

              <IonItem>
                <IonLabel>{profile.description}</IonLabel>
              </IonItem>


              <Link to={`/profiles/${profile.profileId}/edit`}>
                <IonButton color="primary">Upload Image</IonButton>
              </Link>
              <IonButton onClick={onEdit} color="secondary">Edit</IonButton>
              <IonButton onClick={() => { onProfileDelete(profile.profileId) }} color="danger">Delete</IonButton>

            </IonCardContent>
          </IonCard>

        )
      } else {
        return (
          <>
            {newProfileCard()}
          </>
        )
      }
  }


  return (
    <>
      <AuthenticationCheck auth={props.auth} />
      <IonPage>
        <PageHeader name="Profile" />
        <IonContent>
          {card()}
        </IonContent>
      </IonPage>
    </>
  );
}
