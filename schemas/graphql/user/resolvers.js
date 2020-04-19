import { PubSub } from 'graphql-subscriptions'
import { LOGIN_STRATEGY, passport } from '../../../configuration/passport'

const pubSub = new PubSub()

const Query = {
	users: (_, __, { dataSources }) => {
		console.log('Query on users findAll')
		return dataSources.userAPI.findAll()
	},
}

const Mutation = {
	createUser: async(_, { user }, { dataSources }) => {
		try {
			console.log(`Mutation createUser`)
			await dataSources.userAPI.registerUser(user)
			await pubSub.publish('userAdded', { userAdded: user })
		} catch(e) {
			console.error(e)
		}
		return user
	},
}

const Subscription = {
	userAdded: {
		subscribe: () => pubSub.asyncIterator(['userAdded']),
	},
}

export default { Query, Mutation, Subscription }