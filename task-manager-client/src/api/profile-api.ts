import { apiEndpoint } from '../config'
import { Profile } from '../types/Profile';
import { CreateProfileRequest } from '../types/CreateProfileRequest';
import Axios from 'axios'
import { UpdateProfileRequest } from '../types/UpdateProfileRequest';

export async function getProfiles(idToken: string): Promise<Profile> {
  console.log('Fetching Profiles')

  const response = await Axios.get(`${apiEndpoint}/profiles`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Profiles:', response.data)
  
  return response.data.items
}

export async function createProfile(
  idToken: string,
  newProfile: CreateProfileRequest
): Promise<Profile> {
  const response = await Axios.post(`${apiEndpoint}/profiles`, JSON.stringify(newProfile), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchProfile(
  idToken: string,
  profileId: string,
  updatedProfile: UpdateProfileRequest
): Promise<void> {
  debugger
  await Axios.patch(`${apiEndpoint}/profiles/${profileId}`, JSON.stringify(updatedProfile), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteProfile(
  idToken: string,
  profileId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/profiles/${profileId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  profileId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/profiles/${profileId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
