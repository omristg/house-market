import { useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { toast } from 'react-toastify'
import { ReactComponent as KeyboardArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { OAuth } from '../cmps/OAuth'
import { userService } from "../services/user.service"


export const Signup = () => {

    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const { name, email, password } = formData

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
            const userCredentials = await createUserWithEmailAndPassword(
                auth, email, password
            )
            const user = userCredentials.user
            updateProfile(auth.currentUser, {
                displayName: name
            })

            const formDataCopy = { ...formData }
            delete formDataCopy.password
            await userService.update(user.uid, formDataCopy)

            navigate('/')
        } catch (err) {
            toast.error('There was a problem')
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
                    <input type="text" className="name-input"
                        id="name"
                        value={name}
                        onChange={handleChange}
                        placeholder="Name"
                    />

                    <input type="email" className="email-input"
                        id="email"
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
                    <div className="signUpBar">
                        <p className="SignUpText">
                            Sign Up
                        </p>
                        <button className="signUpButton">
                            <KeyboardArrowRightIcon fill="#fff" width="34px" height="34px" />
                        </button>
                    </div>
                </form>

                <OAuth />

                <Link to="/login" className="registerLink">Login Instead</Link>
            </div>
        </>
    )
}