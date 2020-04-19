import {createError} from 'apollo-errors'


export const UserNotFoundError = createError('UserNotFoundError', {
  message: 'User was not found or is not authenticated'
})