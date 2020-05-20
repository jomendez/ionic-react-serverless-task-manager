import * as uuid from 'uuid'
import { Access } from '../data-layer/access'
import { TaskItem } from '../models/TaskItem'
import { TaskUpdate } from '../models/TaskUpdate'
import { CreateTaskRequest } from '../requests/CreateTaskRequest'
import { UpdateTaskRequest } from '../requests/UpdateTaskRequest'
import { createLogger } from '../utils/logger'

const tasksS3FileBucket = process.env.TASKS_FILES_S3_BUCKET;
const region = process.env.REGION;

const access = new Access();
const logger = createLogger('business logic')

export async function createTask(userId, newTask: CreateTaskRequest): Promise<TaskItem> {
  logger.info('create task', {
    userId,
    newTask
  })

  const createdAt = (new Date()).toISOString();
  const taskId = uuid.v4();
  const taskItem: TaskItem = {
    taskId,
    userId,
    createdAt,
    done: false,
    attachmentUrl: `https://${tasksS3FileBucket}.s3${region ? `.${region}` : ''}.amazonaws.com/${taskId}`,
    ...newTask
  };

  logger.info('create task item', { taskItem })

  await access.createTask(taskItem)

  return taskItem
}

export async function getAllTasks(userId: string): Promise<TaskItem[]> {
  logger.info('get all tasks', { userId })

  const items = await access.getAllTasks(userId)

  logger.info('get all tasks items', { items })

  return items
}

export async function updateTask(userId: string, taskId: string, updatedTask: UpdateTaskRequest): Promise<void> {
  logger.info('update task', {
    userId,
    taskId,
    updatedTask
  })

  const result = await access.getTask(userId, taskId)

  logger.info('update task item', { result })

  if (!result) {
    throw {
      statusCode: 404,
      message: 'No records found'
    }
  }

  const
    { createdAt } = result,
    {
      name,
      text,
      dueDate,
      done
    } = updatedTask,
    taskItem: TaskUpdate = {
      name,
      text,
      dueDate,
      done
    }

  await access.updateTask(userId, createdAt, taskItem)
}

export async function deleteTask(userId: string, taskId: string): Promise<void> {
  logger.info('delete task', {
    userId,
    taskId
  })

  const result = await access.getTask(userId, taskId)

  logger.info('delete task item', { result })

  if (!result) {
    throw {
      statusCode: 404,
      message: 'No records found'
    }
  }

  const { createdAt } = result

  await access.deleteTask(userId, createdAt)
}

export function generateTaskUploadUrl(taskId: string) {
  logger.info('generate task upload url', { taskId })

  const uploadUrl = access.getTaskFileUploadSignedUrl(taskId)

  logger.info('generate task upload url uploadUrl', { uploadUrl })

  return uploadUrl
}