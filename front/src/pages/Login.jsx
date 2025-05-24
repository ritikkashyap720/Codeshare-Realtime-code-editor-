import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import '../loginSignup.css'
import backGround from "../assets/background.png"

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [err, setErr] = useState("")

    // check if user is logged in 

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

                        if (result.msg == "authorized") {
                            navigate("/")
                        }
                    }
                } catch (error) {
                    toast.error(error)
                }
            }
        }
        checkAuth()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('https://codeshare-backend-51du.onrender.com/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                email: formData.email,
                password: formData.password
            })
        });
        if (response) {
            const result = await response.json()
            console.log(result)
            if (result.token) {
                localStorage.setItem("token", result.token);
                localStorage.setItem("name", result.name);
                localStorage.setItem("id", result.id);
                navigate("/")
                toast.success("Login succesfull", {
                    duration: 1000,
                    position: 'top-center',
                })
            } else {
                toast.error(result.err, {
                    duration: 1000,
                    position: 'top-center',
                })
            }
        }


        setFormData({
            name: '',
            email: '',
            password: ''
        });
    };


    return (
        
        <div className='container'>
            <img className='background' src={backGround} alt="" />
            <h1 className='brandname'>Code Share</h1>
            <form className='form' onSubmit={handleSubmit}>
                <h1>Welcome back</h1>
                <div className='input'>
                    <label className='label' htmlFor="email">Email</label>
                    <input
                        className='inputField'
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='Enter your email'
                        required
                    />
                </div>
                <div className='input'>
                    <label className='label' htmlFor="password">Password</label>
                    <input
                    className='inputField'
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        placeholder='Enter your password'
                        onChange={handleChange}
                        required
                    />
                </div>
                {err && <p>{err}</p>}
                <button className='btn' type="submit">Login</button>
                <p>Don't have an account? <Link to="/signup" className='link'> Sign Up</Link></p>
                
            </form>
        </div>
    )
}
