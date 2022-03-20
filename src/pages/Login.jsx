import { useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { ReactComponent as KeyboardArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { OAuth } from '../cmps/OAuth'

export const Login = () => {

    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const { email, password } = formData

    const handleChange = ({ target }) => {
        setFormData(prevState => ({
            ...prevState,
            [target.id]: target.value
        }))
    }

    const onShowPassword = () => {
        setShowPassword(prevState => !prevState)
        setTimeout(() => {
            setShowPassword(false)
        }, 1000)
    }

    const onSubmit = async (ev) => {
        ev.preventDefault()
        try {
            const auth = getAuth()
            const userCredentials = await signInWithEmailAndPassword(
                auth, email, password
            )
            if (userCredentials.user) navigate('/')
        } catch (err) {
            toast.error('Invalid username or password')
        }
    }

    return (
        <>
            <div className="page-container">
                <header>
                    <p className="page-header">
                        Welcome Back
                    </p>
                </header>
                <form onSubmit={onSubmit}>
                    <input type="email" className="email-input"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        placeholder="Email"
                    />

                    <div className="password-input-container">

                        <input type={showPassword ? "text" : "password"}
                            className="password-input"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handleChange}
                            placeholder="Password"
                            onBlur={() => setShowPassword(false)}
                        />

                        <img src={visibilityIcon} alt="show password"
                            className="show-password"
                            onClick={onShowPassword}
                        />
                    </div>
                    <Link to="/forgot-password" className="forgot-password-link">
                        Forgot Password
                    </Link>
                    <div className="signInBar">
                        <p className="SignInText">Login</p>
                        <button className="signInButton">
                            <KeyboardArrowRightIcon fill="#fff" width="34px" height="34px" />
                        </button>
                    </div>
                </form>

                <OAuth />

                <Link to="/signup" className="registerLink">Sign Up Instead</Link>
            </div>
        </>
    )
}