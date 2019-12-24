import { model } from 'mongoose'
import Duck from '../schemas/ducks/Duck'

/**
 *
 * @param duck {Duck}
 * @returns {Promise<void>}
 */
Duck.statics.save = async function( duck ) {
  console.log(
    `Saving duck: ${ JSON.stringify( duck, null, 2 ) }, 
    For user: ${ JSON.stringify( duck.createdBy, null, 2 ) }`
  )

  return await this.save( duck )
}

export default model( 'Duck', Duck )