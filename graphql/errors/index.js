import { createError } from 'apollo-errors'


export const UserNotFoundError = createError( 'UserNotFoundError', {
  message: 'User was not found or is not authenticated',
} )

export const UserAlreadyExistsError = createError( 'UserAlreadyExistsError', {
  message: 'This email or username is already registered!',
} )
