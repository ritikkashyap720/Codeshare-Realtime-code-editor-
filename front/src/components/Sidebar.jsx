import React from 'react'
import Users from './Users'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LogoutIcon from '@mui/icons-material/Logout';

function Sidebar({ users,roomId }) {
  const navigate = useNavigate()

  function handleLeaveRoom(){
    navigate("/")
  }
  async function handleCopyRoomId (){
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room Id copied to clipboard", {
        duration: 1000
      })
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }
  users = users.sort((a, b) => a.name.localeCompare(b.name))
  console.log(roomId)
  return (
    <div className='sidebar'>
      <div className='sidebarTop'>
        <div className="navbar">Codeshare</div>
        <div className="userList">
          Connected users
          <div className="list">
            {users.map((user, index) => (<Users key={index} name={user.name} />))}
          </div>
        </div>
      </div>
      <div className="bottomButtons">
        <button className='copycode' onClick={handleCopyRoomId}><ContentCopyIcon/> Copy Room Id</button>
        <button className='leave' onClick={handleLeaveRoom}><LogoutIcon/> Leave Room</button>
      </div>
    </div>
  )
}

export default Sidebar
