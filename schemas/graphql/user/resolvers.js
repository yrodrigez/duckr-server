import { PubSub } from 'graphql-subscriptions'
import { UserAlreadyExistsError } from '../errors'

const pubSub = new PubSub()

const Query = {
  users: ( _, __, { dataSources } ) => {
    return dataSources.userAPI.findAll()
  },
}

const Mutation = {
  createUser: async( _, { user }, { dataSources } ) => {
    const { userAPI } = dataSources
    try {
      await userAPI.registerUser( user )
      await pubSub.publish( 'userAdded', { userAdded: user } )

      return user
    } catch( e ) {
      if( e.name === 'MongoError' && e.code === 11000 ) throw new UserAlreadyExistsError()

      throw e
    }
  },
}

const Subscription = {
  userAdded: {
    subscribe: () => pubSub.asyncIterator( [ 'userAdded' ] ),
  },
}

export default { Query, Mutation, Subscription }