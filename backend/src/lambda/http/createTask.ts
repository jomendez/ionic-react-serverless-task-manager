import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTaskRequest } from '../../requests/CreateTaskRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { createTask } from '../../business-logic/tasks-crud'

const createTaskLogger = createLogger('createTaskLambda')
const accessControlAllowOrigin = { 'Access-Control-Allow-Origin': '*' }

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  createTaskLogger.info('Processing event', { event })

  const taskNew: CreateTaskRequest = JSON.parse(event.body)

  let taskItem, userId

  try {
    userId = getUserId(event)
    taskItem = await createTask(userId, taskNew)
  } catch (error) {
    createTaskLogger.error('Error while trying to insert task', {
      error,
      userId,
      taskNew
    })

    return {
      statusCode: error.statusCode || 500,
      headers: accessControlAllowOrigin,
      body: JSON.stringify({ error })
    }
  }

  return {
    statusCode: 201,
    headers: accessControlAllowOrigin,
    body: JSON.stringify({ item: taskItem })
  }
}
