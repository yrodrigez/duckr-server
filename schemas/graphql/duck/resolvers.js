import { PubSub } from 'graphql-subscriptions'
import { UserNotFoundError } from '../errors'

const pubSub = new PubSub()
const Query = {
  ducks: ( root, args, { user } ) => {
    if( !user ) {
      console.error( `Error: typeof user ${ typeof user }` )
      throw new UserNotFoundError()
    }

    console.log( `Query ducks for user: ${ user }` )
    return []
  },
}
const Subscription = {
  duckAdded: () => null,
}

const Mutation = {}
export default { Query, Subscription, Mutation }