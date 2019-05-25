import { gql } from 'apollo-server-express'


const typeDefs = gql`
	type Query {
		hello: String
		users: [User]
	}
	type User {
		username: String,
		email: String
	}
	input UserInput{
		username: String,
		email: String
	}
	type Mutation {
		createUser(user: UserInput): User
	}
	type Subscription {
		userAdded: User
	}
`


export default {typeDefs}