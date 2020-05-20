import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { deleteProfile } from '../../business-logic/user-crud'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const accessControlAllowOrigin = { 'Access-Control-Allow-Origin': '*' }

const deleteProfileLogger = createLogger('deleteProfile')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  deleteProfileLogger.info('Processing event', { event })

  const profileId = event.pathParameters.profileId

  if (!profileId) {
    const message = 'Missing TASK Id'

    deleteProfileLogger.error(message)

    return {
      statusCode: 400,
      headers: accessControlAllowOrigin,
      body: JSON.stringify({ error: message })
    }
  }

  let userId

  try {
    userId = getUserId(event)

   await deleteProfile(userId, profileId)
  } catch (error) {
    deleteProfileLogger.info('Error while trying to delete an item', {
      error,
      userId,
      profileId
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
