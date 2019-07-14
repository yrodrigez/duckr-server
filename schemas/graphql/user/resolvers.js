import { PubSub } from 'graphql-subscriptions'
import { LOGIN_STRATEGY, passport } from '../../../configuration/passport'

const pubSub = new PubSub()

const Query = {
	users: (_, __, { dataSources }) => {
		console.log('Query on users findAll')
		return dataSources.userAPI.findAll()
	},

	loginUser: async(_, { user }) => {
		console.log(user)
		passport.authenticate(LOGIN_STRATEGY.LOCAL,(err, user, info) => {
			if(info) {
				return console.warn(info.message)
			}
			if(err) {
				return next(err)
			}
			//if (!user) { return res.redirect('/login'); }
			/*req.login(user, (err) => {
				if(err) {
					return next(err)
				}
				return res.redirect('/authrequired')
			})*/
		})
	}
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