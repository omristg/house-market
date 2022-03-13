import { useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { ReactComponent as KeyboardArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

export const Signin = () => {

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

    return (
        <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">
                        Welcome Back
                    </p>
                </header>
                <form>
                    <input type="email" className="emailInput"
                        id="email"
                        name="email"
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
                    <div className="signInBar">
                        <p className="SignInText">
                            Sign In
                        </p>
                        <button className="signInButton">
                            <KeyboardArrowRightIcon fill="#fff" width="34px" height="34px" />
                        </button>
                    </div>
                </form>
                <Link to="/signup" className="registerLink">Sign Up Instead</Link>
            </div>
        </>
    )
}