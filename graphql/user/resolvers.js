import { UserAlreadyExistsError } from '../errors'

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

      return user
    } catch( e ) {
      if( e.name === 'MongoError' && e.code === 11000 ) throw new UserAlreadyExistsError()

      throw e
    }
  },
}



export default { Query, Mutation }