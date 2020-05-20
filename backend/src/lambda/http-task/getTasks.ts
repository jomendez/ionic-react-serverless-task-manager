import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { getAllTasks } from '../../business-logic/tasks-crud'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const accessControlAllowOrigin = { 'Access-Control-Allow-Origin': '*' }
const getTasksLogger = createLogger('getTask')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  getTasksLogger.info('Processing event', { event })

  let userId, tasks

  try {
    const userId = getUserId(event)

    tasks = await getAllTasks(userId)
  } catch (error) {
    getTasksLogger.error('Error while trying to get tasks', {
      error,
      userId
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
    body: JSON.stringify({ items: tasks })
  }
}
