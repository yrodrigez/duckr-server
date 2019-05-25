import { PubSub } from 'graphql-subscriptions'


const pubsub = new PubSub()

const resolvers = {
	Query: {
		hello: () => 'Hello world!',
		users: (_, __, {dataSources}) => dataSources.userAPI.findAll(),
	},
	Mutation: {
		createUser: async (_, {user}, {dataSources}) => {
			dataSources.userAPI.create(user)
			try {
				await pubsub.publish('userAdded', {userAdded: user})
			} catch (e) {
				console.error(e)
			}
			return user
		},
	},
	Subscription: {
		userAdded: {
			subscribe: () => pubsub.asyncIterator(['userAdded']),
		},
	},
}

export default {resolvers}