import {UserNotFoundError} from '../errors'

const Query = {
  ducks: ( root, args, { user, dataSources } ) => {
    if( !user ) {
      throw new UserNotFoundError()
    }

    const { duckAPI } = dataSources

    return []
  },
}

const Mutation = {
  duck: async( _, { duck }, { user, dataSources } ) => {
    if( !user ) {
      throw new UserNotFoundError()
    }

    const { duckAPI } = dataSources
    return await duckAPI.createDuck({data: duck.data, userId: user._id})
  },

}
export default { Query, Mutation }