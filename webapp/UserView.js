import React, { useState } from 'react'
import { useQuery, useSubscription, useMutation } from 'react-apollo-hooks'
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

const ADD_USER = gql`
	mutation createUser($user: UserInput){
		createUser(user: $user) {
			username,
			email
		}
	}

`

const UserView = () => {
	let {loading, error, data: {users}} = useQuery(USERS)
	const [user, setUser] = useState({username: '', email: ''})
	const addUser = useMutation(ADD_USER)
	const {data, sLoading, sError} = useSubscription(USER_ADDED_SUBSCRIPTION)
	if (sError) return 'Error on subs' + ` ${error.message}`
	if (sLoading) return `Subscription loading...`
	if (data && data.userAdded) users = [...users, data.userAdded]

	return loading ? 'loading...' :
		error ? 'error' : <>
			<div>
				<input placeholder="username" type="text" onChange={e => setUser({...user, username: e.target.value})}/>
				<input placeholder="email" type="text" onChange={e => setUser({...user, email: e.target.value})}/>
				<button onClick={() => addUser({variables: {user}})}>Send</button>
			</div>
			<UserList users={users}/>
		</>

}
export default UserView