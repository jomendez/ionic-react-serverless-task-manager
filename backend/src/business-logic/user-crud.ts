import * as uuid from 'uuid';
import { UserAccess } from '../data-layer/user-access';
import { ProfileItem } from '../models/ProfileItem';
import { ProfileUpdate } from '../models/ProfileUpdate';
import { CreateProfileRequest } from '../requests/CreateProfileRequest';
import { UpdateProfileRequest } from '../requests/UpdateProfileRequest';
import { createLogger } from '../utils/logger';


const profilesS3FileBucket = process.env.PROFILES_FILES_S3_BUCKET;
const region = process.env.REGION;

const access = new UserAccess();
const logger = createLogger('business logic')

export async function getProfile(userId: string): Promise<ProfileItem> {
  logger.info('get profile', { userId })

  const item = await access.getProfile(userId)

  logger.info('get profile items', { item })

  return item
}

export async function createProfile(userId, newProfile: CreateProfileRequest): Promise<ProfileItem> {
  logger.info('create profile', {
    userId,
    newProfile
  })

  const createdAt = (new Date()).toISOString();
  const profileId = uuid.v4();
  const profileItem: ProfileItem = {
    profileId,
    userId,
    createdAt,
    attachmentUrl: `https://${profilesS3FileBucket}.s3${region ? `.${region}` : ''}.amazonaws.com/${profileId}`,
    ...newProfile
  };

  logger.info('create profile item', { profileItem })

  await access.createProfile(profileItem)

  return profileItem
}

export async function updateProfile(userId: string, profileId: string, updatedProfile: UpdateProfileRequest): Promise<void> {
  logger.info('update profile', {
    userId,
    profileId,
    updatedProfile
  })

  const result = await access.getProfile(userId)

  logger.info('update profile item', { result })

  if (!result) {
    throw {
      statusCode: 404,
      message: 'No records found'
    }
  }

  const
    { createdAt } = result,
    {
      userName,
      description
    } = updatedProfile,
    profileItem: ProfileUpdate = {
      userName,
      description
    }

  await access.updateProfile(userId, createdAt, profileItem)
}

export async function deleteProfile(userId: string, profileId: string): Promise<void> {
  logger.info('delete profile', {
    userId,
    profileId
  })

  const result = await access.getProfile(userId)

  logger.info('delete profile item', { result })

  if (!result) {
    throw {
      statusCode: 404,
      message: 'No records found'
    }
  }

  const { createdAt } = result

  await access.deleteProfile(userId, createdAt)
}

export function generateProfileUploadUrl(profileId: string) {
  logger.info('generate profile upload url', { profileId })

  const uploadUrl = access.getProfileFileUploadSignedUrl(profileId)

  logger.info('generate profile upload url uploadUrl', { uploadUrl })

  return uploadUrl
}