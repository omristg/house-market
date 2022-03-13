import { useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { ReactComponent as KeyboardArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

export const Signup = () => {

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

    return (
        <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">
                        Welcome Back
                    </p>
                </header>
                <form>
                    <input type="text" className="nameInput"
                        id="name"
                        value={name}
                        onChange={handleChange}
                        placeholder="Name"
                    />

                    <input type="email" className="emailInput"
                        id="email"
                        value={email}
                        onChange={handleChange}
                        placeholder="Email"
                    />

                    <div className="passwordInputDiv">
                        <input type={showPassword ? "text" : "password"}
                            className="passwordInput"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handleChange}
                            placeholder="Password"
                            onBlur={() => setShowPassword(false)}
                        />
                        <img src={visibilityIcon} alt="show password"
                            className="showPassword"
                            onClick={onShowPassword}
                        />
                    </div>
                    <Link to="/forgot-password" className="forgotPasswordLink">
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
                <Link to="/signin" className="registerLink">Sign In Instead</Link>
            </div>
        </>
    )
}