import { PubSub } from 'graphql-subscriptions'


const pubsub = new PubSub()

const Query = {
	users: (_, __, { dataSources }) => {
		console.log('Query on users findAll')
		return dataSources.userAPI.findAll()
	},
}

const Mutation = {
	createUser: async(_, { user }, { dataSources }) => {
		dataSources.userAPI.create(user)
		try {
			await pubsub.publish('userAdded', { userAdded: user })
		} catch(e) {
			console.error(e)
		}
		return user
	},
}

const Subscription = {
	userAdded: {
		subscribe: () => pubsub.asyncIterator(['userAdded']),
	},
}

export default { Query, Mutation, Subscription }