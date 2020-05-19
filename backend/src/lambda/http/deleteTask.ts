import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { deleteTask } from '../../business-logic/tasks-crud'

const accessControlAllowOrigin = { 'Access-Control-Allow-Origin': '*' }

const deleteTaskLogger = createLogger('deleteTask')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  deleteTaskLogger.info('Processing event', { event })

  const taskId = event.pathParameters.taskId

  if (!taskId) {
    const message = 'Missing TASK Id'

    deleteTaskLogger.error(message)

    return {
      statusCode: 400,
      headers: accessControlAllowOrigin,
      body: JSON.stringify({ error: message })
    }
  }

  let userId

  try {
    userId = getUserId(event)

    await deleteTask(userId, taskId)
  } catch (error) {
    deleteTaskLogger.info('Error while trying to delete an item', {
      error,
      userId,
      taskId
     })

    return {
      statusCode: error.statusCode || 501,
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
