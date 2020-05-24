import { PubSub } from 'graphql-subscriptions'
import { UserNotFoundError } from '../errors'

const pubSub = new PubSub()
const Query = {
  ducks: ( root, args, { user, dataSources } ) => {
    if( !user ) {
      throw new UserNotFoundError()
    }

    const { duckAPI } = dataSources

    return []
  },
}
const Subscription = {
  newDuck: ( duck ) => {
    console.log( duck )
  },
}

const Mutation = {
  duck: async( _, { duck }, { user, dataSources } ) => {
    if( !user ) {
      throw new UserNotFoundError()
    }

    const { duckAPI } = dataSources
    const newDuck = await duckAPI.createDuck( { data: duck.data, userId: user._id } )
    await pubSub.publish( 'newDuck', { newDuck: newDuck } )

    return newDuck
  },

}
export default { Query, Subscription, Mutation }