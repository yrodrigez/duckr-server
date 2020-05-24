import { model } from 'mongoose'
import Duck from '../schemas/ducks/Duck'

/**
 *
 * @param duck {Duck}
 * @returns {Promise<void>}
 */
Duck.statics.createDuck = async function( { data, userId } ) {
  return await this.create( {
    data,
    created: new Date().getTime(),
    createdBy: userId,
    visible: true,
    likeCount: 0
  } )
}
Duck.statics.queryAllDucks = function() {
  return this.findAll().sort( { created: -1 } )
}

export default model( 'Duck', Duck )