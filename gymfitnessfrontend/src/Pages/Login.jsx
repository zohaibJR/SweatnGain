import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import './Style/Signup.css'

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const goToSignUp= () => {
        navigate('/signup')
    }

    const handleLogin = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/users/login", {
                email,
                password
            });

            if(res.data.success){
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("userEmail", email); // <-- store email
                    navigate('/dashboard');
            } else {
                alert("Login failed");
            }

        } catch (err) {
            alert(err.response?.data?.message || "Login failed");
        }
    }

  return (
    <div className='LoginMainDiv'>
        <div className='InnerDiv'>
            <div className='LeftSide'>
                <img alt="Pic here" />
            </div>

            <div className="RightSide">
                <img alt="Logo Here" />
                <h1>Login</h1>

                <div className="InputFeilds">
                    <input 
                        type="text" 
                        placeholder='Enter Email Address'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input 
                        type="password"
                        placeholder='Enter Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <a href="">Forgot Password</a>

                <button onClick={handleLogin}>Login</button>

                <div className='SignUpText'>
                    <h4>Don't have your Account ? <a href="#" onClick={(e) => { e.preventDefault(); goToSignUp(); }}>Sign up</a></h4>
                </div>

            </div>
        </div>
    </div>
  )
}

export default Login
