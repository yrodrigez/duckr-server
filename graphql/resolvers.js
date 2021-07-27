import UserResolvers from './user/resolvers'
import DuckResolvers from './duck/resolvers'

export default {
	Mutation: {
		...UserResolvers.Mutation,
		...DuckResolvers.Mutation,
	},
	Query: {
		...UserResolvers.Query,
		...DuckResolvers.Query,
	}
}