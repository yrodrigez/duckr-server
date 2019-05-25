import React, { useState } from 'react'
import { useQuery, useSubscription } from 'react-apollo-hooks'
import { Query, Subscription } from 'react-apollo'
import gql from 'graphql-tag'
import UserList from './components/UserList'


const USERS = gql`
	{
		users {username, email}
	}
`

const USER_ADDED_SUBSCRIPTION = gql`
	subscription userAdded{
		userAdded{
			username,
			email
		}
	}
`

const UserView = () => {
	let {loading, error, data: {users}} = useQuery(USERS)
	const {data, sLoading, sError} = useSubscription(USER_ADDED_SUBSCRIPTION)

	if (sError) return 'Error on subs' + ` ${error.message}`
	if (sLoading) return `Subscription loading...`
	if (data && data.userAdded) users = [...users, data.userAdded]

	return loading ? 'loading...' :
		error ? 'error' :
			<UserList users={users}/>

}
export default UserView