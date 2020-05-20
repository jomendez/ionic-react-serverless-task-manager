import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { ProfileItem } from '../models/ProfileItem'
import { ProfileUpdate } from '../models/ProfileUpdate'
import { createLogger } from '../utils/logger'

const AWSXRay = require('aws-xray-sdk')



const
  XAWS = AWSXRay.captureAWS(AWS),
  profilesAccessLogger = createLogger('profilesAccess')

export class UserAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly profilesIdIndex = process.env.PROFILES_ID_INDEX,
    private readonly profilesTable = process.env.PROFILES_TABLE,
    private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
    private readonly bucketName = process.env.PROFILES_FILES_S3_BUCKET
  ) {
    profilesAccessLogger.info('constructing access class', {
      profilesTable,
      profilesIdIndex
    })
  }

  async getAllprofile(userId: string): Promise<ProfileItem[]> {
    profilesAccessLogger.info('getting all profile', { userId })

    let profileItem = []

    const result = await this.docClient.query({
      TableName: this.profilesTable,
      IndexName: this.profilesIdIndex,
      KeyConditionExpression: 'userId=:userId',
      ExpressionAttributeValues: { ':userId': userId },
      ScanIndexForward: false
    }).promise()

    const { Items } = result

    if (Items && Items.length) {
      profileItem = Items
    }

    return profileItem
  }

  async createProfile(profileItem: ProfileItem): Promise<void> {
    profilesAccessLogger.info('creating new profile', { profileItem })

    await this.docClient.put({
      TableName: this.profilesTable,
      Item: profileItem
    }).promise()
  }

  async updateProfile(userId: string, createdAt: string, profileItem: ProfileUpdate): Promise<void> {
    profilesAccessLogger.info('updating profile', {
      userId,
      createdAt,
      profileItem
    })

    const {
      userName,
      description
    } = profileItem

    await this.docClient.update({
      TableName: this.profilesTable,
      Key: {
        userId,
        createdAt
      },
      UpdateExpression: 'set userName=:userName, description=:description',
      ExpressionAttributeValues: {
        ':userName': userName,
        ':description': description,
      }
    }).promise()
  }

  async getProfile(userId: string): Promise<ProfileItem> {
    profilesAccessLogger.info('getting a profile', {
      userId
    })

    let profileItem

    const result = await this.docClient.query({
      TableName: this.profilesTable,
      IndexName: this.profilesIdIndex,
      KeyConditionExpression: 'userId=:userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()

    const { Items } = result

    if (Items && Items.length) {
      [profileItem] = Items
    }

    return profileItem
  }

  getProfileFileUploadSignedUrl(profileId: string): string {
    profilesAccessLogger.info('getting profile file upload signed url', { profileId })

    const uploadUrl = this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: profileId,
      Expires: Number(this.urlExpiration)
    })

    profilesAccessLogger.info('getting profile file upload signed url uploadUrl', { uploadUrl })

    return uploadUrl
  }


  async deleteProfile(userId: string, createdAt: string): Promise<void> {
    profilesAccessLogger.info('deleting profile', {
      userId,
      createdAt
    })

    await this.docClient.delete({
      TableName: this.profilesTable,
      Key: {
        userId,
        createdAt
      }
    }).promise()
  }

}