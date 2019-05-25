import React,  {useState} from 'react'


const UserList = ({users}) => {

  return (
    <ul>
	  {users.map(x => <li><span>{x.username}</span><span>{x.email}</span></li>)}
	</ul>
  )
}

export default UserList