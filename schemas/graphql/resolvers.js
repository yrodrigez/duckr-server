import UserResolvers from './user/resolvers'

export default {
	Mutation: {
		...UserResolvers.Mutation,
	},
	Query: {
		...UserResolvers.Query,
	},
	Subscription : {
		...UserResolvers.Subscription,
	}
}