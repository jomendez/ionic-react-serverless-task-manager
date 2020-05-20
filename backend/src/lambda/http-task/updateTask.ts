import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { updateTask } from '../../business-logic/tasks-crud'
import { UpdateTaskRequest } from '../../requests/UpdateTaskRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const accessControlAllowOrigin = { 'Access-Control-Allow-Origin': '*' }
const updateTaskLogger = createLogger('updateTask')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  updateTaskLogger.info('Processing event', { event })

  const taskId = event.pathParameters.taskId

  if (!taskId) {
    const message = 'Missing taskId'

    updateTaskLogger.error(message)

    return {
      statusCode: 400,
      headers: accessControlAllowOrigin,
      body: JSON.stringify({ error: message })
    }
  }

  const updateItem: UpdateTaskRequest = JSON.parse(event.body)
  let userId

  try {
    userId = getUserId(event)

    await updateTask(userId, taskId, updateItem)
  } catch (error) {
    updateTaskLogger.error('Error while trying to update item', {
      error,
      userId,
      updateItem
    })

    return {
      statusCode: 500,
      headers: accessControlAllowOrigin,
      body: JSON.stringify({ error })
    }
  }

  return {
    statusCode: 200,
    headers: accessControlAllowOrigin,
    body: JSON.stringify({})
  }
}
