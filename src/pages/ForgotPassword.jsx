import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { toast } from 'react-toastify'
import { ReactComponent as KeyboardArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'

export const ForgotPassword = () => {

    const [email, setEmail] = useState('')

    const handleChange = ({ target: { value } }) => {
        setEmail(value)
    }

    const onSubmit = async (ev) => {
        ev.preventDefault()
        try {
            const auth = getAuth()
            sendPasswordResetEmail(auth, email)
            toast.success('Email was sent')

        } catch (error) {
            toast.error('Cound not send Email')
        }
    }

    return (
        <div className="pageContainer">
            <header>
                <p className="pageHeader">Forgot Password</p>
            </header>

            <main>
                <form onSubmit={onSubmit}>
                    <input type="email"
                        id='email'
                        className='emailInput'
                        value={email}
                        onChange={handleChange}
                        placeholder="Email"
                    />
                </form>

                <Link className='forgotPasswordLink' to="/signin">Sign In</Link>

                <div className="signInBar">
                    <div className="signInText">Send Reset Link</div>
                    <button className="signInButton">
                        <KeyboardArrowRightIcon fill="#fff" width="34px" height="34px" />
                    </button>
                </div>
            </main>
        </div>
    )
}