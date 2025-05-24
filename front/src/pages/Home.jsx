import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import backGround from "../assets/background.png"
import toast from 'react-hot-toast';

function Home() {
    const navigate = useNavigate();
    const name = localStorage.getItem("name")

    useEffect(() => {
        async function checkAuth() {
            const token = localStorage.getItem("token")
            const id = localStorage.getItem("id");
            const username = localStorage.getItem("name")

            if (token != null && username != null && id != null) {
                try {
                    const response = await fetch('https://codeshare-backend-51du.onrender.com/auth', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response) {
                        const result = await response.json()
                        if (result.msg == "unauthorized") {
                            navigate("/login")
                        }
                    } else {
                        toast.error("connection failed")
                    }
                } catch (error) {
                    toast.error(error)
                }
            } else {
                navigate("/login")
            }
        }
        checkAuth()
    }, [])
    function sendMessage() {
        const uniqueId = uuidv4();
        console.log(uniqueId)
        navigate(`/editor/${uniqueId}`)

    }

    const [roomName, setRoomName] = useState('');

    const handleChange = (e) => {
        setRoomName(e.target.value)
    };

    const handleJoinRoom = (e) => {
        e.preventDefault();
        if (roomName.trim() !== "") {
            navigate(`/editor/${roomName}`)
        }
    };

    return (
        <div className='container'>
            <img className='background' src={backGround} alt="" />
            <form className='formJoinRoom' onSubmit={handleJoinRoom}>
                <div className="info">
                    <div className="brandSmall">CodeShare</div>
                    <p> Here's what makes us special:</p>
                    <div className="description">
                        <ul>
                            <li><span className='bullet'>Supported Languages:</span> Write code in your favorite languages - Java, Python, C++, HTML, CSS and JS are all supported!</li>
                            <li><span className='bullet'>Real-time Collaboration:</span> See your friends' code updates instantly, fostering a seamless teamwork experience.</li>
                            <li><span className='bullet'>Shareable Rooms:</span> Generate a unique room ID to easily invite friends and start coding together.</li>
                            <li><span className='bullet'>Perfect for:</span> Pair programming, group projects, study sessions, or just having fun coding with friends!</li>
                        </ul>
                    </div>
                </div>
                <div className="joinRoom">
                <div className="brandLarge">CodeShare</div>
                    <p className='greeting'>Welcome back, {name}</p>
                    <button className='button' onClick={sendMessage}>Start new room</button>
                    <p>------OR------</p>
                    <input
                        className='inputField'
                        type="text"
                        placeholder="Enter room name"
                        value={roomName}
                        onChange={handleChange}
                    />
                    <button className='button' type="submit">Join Room</button>
                    <button className='btn' onClick={()=>{localStorage.clear(), navigate("/login") }} style={{marginTop:"100px"}}>Logout</button>
                </div>
            </form>
        </div>
    )
}

export default Home
