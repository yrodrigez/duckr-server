import { model } from 'mongoose'
import Ducks from './ducks'

/**
 *
 * @param duck {Ducks}
 * @returns {Promise<void>}
 */
Ducks.statics.createDuck = async function({ data, userId } ) {
  return await this.create( {
    data,
    created: new Date().getTime(),
    createdBy: userId,
    visible: true,
    likeCount: 0
  } )
}
Ducks.statics.queryAllDucks = function() {
  return this.findAll().sort( { created: -1 } )
}

export default model( 'Duck', Ducks )