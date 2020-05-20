import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { updateProfile } from '../../business-logic/user-crud'
import { UpdateProfileRequest } from '../../requests/UpdateProfileRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const updateProfileLogger = createLogger('updateProfile')
const accessControlAllowOrigin = { 'Access-Control-Allow-Origin': '*' }

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  updateProfileLogger.info('Processing event', { event })

  const profileId = event.pathParameters.profileId

  if (!profileId) {
    const message = 'Missing profileId'

    updateProfileLogger.error(message)

    return {
      statusCode: 400,
      headers: accessControlAllowOrigin,
      body: JSON.stringify({ error: message })
    }
  }

  const updateItem: UpdateProfileRequest = JSON.parse(event.body)
  let userId

  try {
    userId = getUserId(event)

    await updateProfile(userId, profileId, updateItem)
  } catch (error) {
    updateProfileLogger.error('Error while trying to update item', {
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
