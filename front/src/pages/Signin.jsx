import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import '../loginSignup.css'
import backGround from "../assets/background.png"

function Signin() {



    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [err, setErr] = useState("")

    // check if user is logged in 

    useEffect(() => {
        async function checkAuth() {
            const token = localStorage.getItem("token")
            if (token) {
                try {
                    const response = await fetch('http://localhost:8000/auth', {
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
                    console.log(error)
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

        console.log(formData);
        const response = await fetch('http://localhost:8000/user/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                name: formData.name,
                email: formData.email,
                password: formData.password
            })
        });
        if (response) {
            const result = await response.json()
            if (result.msg == "success") {
                navigate("/login")
            } else {
                setErr(result.err)
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
            <h1>Create Account</h1>
            <div className='input'>
                    <label className='label' htmlFor="name">Name</label>
                    <input
                        className='inputField'
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder='Enter you name'
                        required
                    />
                </div>
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
            <button className='btn' type="submit">Register</button>
            <p>Already have an account? <Link to="/login" className='link'>Login</Link></p>
            
        </form>
    </div>
    )
}

export default Signin
