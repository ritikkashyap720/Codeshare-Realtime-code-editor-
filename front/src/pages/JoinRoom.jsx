import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import initSocket from '../Socket';
import Actions from '../Action';
import toast from 'react-hot-toast';
import Editor from '../components/Editor';
import Sidebar from '../components/Sidebar';


function JoinRoom() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const socketRef = useRef(null)
    const [users, setUsers] = useState([])
    const codeRef = useRef(null)
    const inputRef = useRef(null)
    const outputRef = useRef(null)
    const languageRef = useRef(null)

    useEffect(() => {
        async function checkAuth() {
            const token = localStorage.getItem("token")
            const username = localStorage.getItem("name")
            const id = localStorage.getItem("id");

            if (token != null && username != null && id != null) {
                try {
                    const response = await fetch('http://localhost:8000/auth', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response) {
                        const result = await response.json()
                        if (result.msg == "unauthorized") {
                            navigate("/login")
                        }
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

    useEffect(() => {
        const id = localStorage.getItem("id");
        const name = localStorage.getItem("name")
        const token = localStorage.getItem("token")
        const init = async () => {
            console.log("id from local ", id)
            socketRef.current = await initSocket()
            socketRef.current.on("connect_error", (err) => handleError(err));
            socketRef.current.on("connect_failed", (err) => handleError(err));
            socketRef.current.emit(Actions.JOIN, { roomId, name, id })

            // dissconnected user
            socketRef.current.on(Actions.DISCONNECTED, ({ socketId, name }) => {
                toast.success(name + " left the room", {
                    duration: 2000,
                    position: "top-right"
                })
                setUsers((prev) => {
                    return prev.filter(user => user.socketId != socketId)
                })
            })
            // joined users
            socketRef.current.on(Actions.JOINED, ({ clients, userId, name }) => {
                setUsers(clients)
                if (userId != id) {
                    toast.success(name + " joined room", {
                        duration: 2000,
                        position: "top-right"
                    })
                }
                const lang = localStorage.getItem("language")
                var code;
                if (lang === "python") {
                    code = localStorage.getItem("pythonCode")
                } else if (lang === "c++") {
                    code = localStorage.getItem("c++Code")
                } else if (lang === "java") {
                    code = localStorage.getItem("javaCode")
                }else  if(lang==="HTML, CSS& JS"){
                    var html = localStorage.getItem("htmlCode")
                    var css = localStorage.getItem("cssCode")
                    var js = localStorage.getItem("jsCode")

                    if(html){
                        socketRef.current.emit(Actions.FRONT_END_CODE_HTML,({html,roomId}))
                    }
                    if(css){
                        socketRef.current.emit(Actions.FRONT_END_CODE_CSS,({css,roomId}))
                    }
                    if(js){
                        socketRef.current.emit(Actions.FRONT_END_CODE_JS,({js,roomId}))
                    }
                }
                const input = inputRef.current
                const output = outputRef.current

                socketRef.current.emit(Actions.SYNC_CODE, ({ code, lang, roomId }))
                socketRef.current.emit(Actions.INPUT_CHANGE, ({ input, roomId }))
                socketRef.current.emit(Actions.OUTPUT_CHANGE, ({ output, roomId }))
                socketRef.current.emit(Actions.LANGUAGE_SYNC, ({ lang, roomId }))
            })

            function handleError(err) {
                console.log("socket err ", err)
                toast.error("Socket connection failed, try again later")
                navigate("/")
            }
        }
        if (id != null && name != null && token != null) {
            init();
            return () => {
                socketRef.current.disconnect();
                socketRef.current.off(Actions.JOINED);
                socketRef.current.off(Actions.DISCONNECTED);
            }
        }
    }, [])

    return (
        <div className='editorPage dark'>
            <Sidebar users={users} roomId={roomId} />
            <Editor onCodeChange={(code) => { codeRef.current = code; }} onInputChange={(input) => { inputRef.current = input; }} onOutputChange={(output) => { outputRef.current = output }} onLanguageChange={(value) => { languageRef.current = value }} socketRef={socketRef} roomId={roomId} lang={languageRef.current} />
        </div>

    )
}

export default JoinRoom
