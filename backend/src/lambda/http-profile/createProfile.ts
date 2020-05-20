import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { createProfile } from '../../business-logic/user-crud'
import { CreateProfileRequest } from '../../requests/CreateProfileRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const createProfileLogger = createLogger('createProfileLambda')
const accessControlAllowOrigin = { 'Access-Control-Allow-Origin': '*' }

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  createProfileLogger.info('Processing event', { event })

  const profileNew: CreateProfileRequest = JSON.parse(event.body)

  let profileItem, userId

  try {
    userId = getUserId(event)
   profileItem = await createProfile(userId, profileNew)
  } catch (error) {
    createProfileLogger.error('Error while trying to insert profile', {
      error,
      userId,
      profileNew
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
    body: JSON.stringify({ item: profileItem })
  }
}
