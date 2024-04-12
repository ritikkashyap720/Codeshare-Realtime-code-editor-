import React from 'react'
import Avatar from 'react-avatar';


function Users(name) {
  return (
    <div className='user'>
        <Avatar name={name.name} size={30} round="6px" textSizeRatio={2}/> 
        <span className='username'>{name.name}</span>
    </div>
  )
}

export default Users
