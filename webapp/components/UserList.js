import React,  {useState} from 'react'


const UserList = ({users}) => {

  return (
    <ul>
	  {users.map(x => <li><span>username: {x.username}</span> <span>email: {x.email}</span></li>)}
	</ul>
  )
}

export default UserList