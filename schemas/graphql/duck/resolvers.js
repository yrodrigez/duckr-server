import { PubSub } from 'graphql-subscriptions'
import { UserNotFoundError } from '../errors'

const pubSub = new PubSub()
const Query = {
  ducks: ( root, args, { user } ) => {
    if( !user ) {
      throw new UserNotFoundError()
    }

    return []
  },
}
const Subscription = {
  duckAdded: () => null,
}

const Mutation = {}
export default { Query, Subscription, Mutation }