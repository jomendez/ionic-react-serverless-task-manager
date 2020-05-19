import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const AWSXRay = require('aws-xray-sdk')

import { TaskItem } from '../models/TaskItem'
import { TaskUpdate } from '../models/TaskUpdate'

import { createLogger } from '../utils/logger'

const
  XAWS = AWSXRay.captureAWS(AWS),
  tasksAccessLogger = createLogger('tasksAccess')

export class Access {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly tasksIdIndex = process.env.TASKS_ID_INDEX,
    private readonly tasksTable = process.env.TASKS_TABLE,
    private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
    private readonly bucketName = process.env.TASKS_FILES_S3_BUCKET
  ) {
    tasksAccessLogger.info('constructing access class', {
      tasksTable,
      tasksIdIndex
    })
  }

  async createTask(taskItem: TaskItem): Promise<void> {
    tasksAccessLogger.info('creating new task', { taskItem })

    await this.docClient.put({
      TableName: this.tasksTable,
      Item: taskItem
    }).promise()
  }

  async updateTask(userId: string, createdAt: string, taskItem: TaskUpdate): Promise<void> {
    tasksAccessLogger.info('updating task', {
      userId,
      createdAt,
      taskItem
    })

    const {
      name,
      dueDate,
      done
    } = taskItem

    await this.docClient.update({
      TableName: this.tasksTable,
      Key: {
        userId,
        createdAt
      },
      UpdateExpression: 'set #taskName=:taskName, dueDate=:dueDate, done=:done',
      ExpressionAttributeNames: { '#taskName': 'name' },
      ExpressionAttributeValues: {
        ':taskName': name,
        ':dueDate': dueDate,
        ':done': done
      }
    }).promise()
  }

  async getAllTasks(userId: string): Promise<TaskItem[]> {
    tasksAccessLogger.info('getting all tasks', { userId })

    let taskItems = []

    const result = await this.docClient.query({
      TableName: this.tasksTable,
      IndexName: this.tasksIdIndex,
      KeyConditionExpression: 'userId=:userId',
      ExpressionAttributeValues: { ':userId': userId },
      ScanIndexForward: false
    }).promise()

    const { Items } = result

    if (Items && Items.length) {
      taskItems = Items
    }

    return taskItems
  }

  async getTask(userId: string, taskId: string): Promise<TaskItem> {
    tasksAccessLogger.info('getting a task', {
      userId,
      taskId
    })

    let taskItem

    const result = await this.docClient.query({
      TableName: this.tasksTable,
      IndexName: this.tasksIdIndex,
      KeyConditionExpression: 'taskId=:taskId AND userId=:userId',
      ExpressionAttributeValues: {
        ':taskId': taskId,
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()

    const { Items } = result

    if (Items && Items.length) {
      [ taskItem ] = Items
    }

    return taskItem
  }

  getTaskFileUploadSignedUrl(taskId: string): string {
    tasksAccessLogger.info('getting task file upload signed url', { taskId })

    const uploadUrl = this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: taskId,
      Expires: Number(this.urlExpiration)
    })

    tasksAccessLogger.info('getting task file upload signed url uploadUrl', { uploadUrl })

    return uploadUrl
  }


  async deleteTask(userId: string, createdAt: string): Promise<void> {
    tasksAccessLogger.info('deleting task', {
      userId,
      createdAt
    })

    await this.docClient.delete({
      TableName: this.tasksTable,
      Key: {
        userId,
        createdAt
      }
    }).promise()
  }

}