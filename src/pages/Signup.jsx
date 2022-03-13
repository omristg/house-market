import { useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { db } from '../firebase.config'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { ReactComponent as KeyboardArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { OAuth } from '../cmps/OAuth'


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
            formDataCopy.timestamp = serverTimestamp()
            await setDoc(doc(db, 'users', user.uid), formDataCopy)

            navigate('/')
        } catch (err) {
            toast.error('There was a problem')
        }
    }

    return (
        <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">
                        Welcome Back
                    </p>
                </header>
                <form onSubmit={onSubmit}>
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
                </form>

                <OAuth />
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
                <Link to="/signin" className="registerLink">Sign In Instead</Link>
            </div>
        </>
    )
}