import { useNavigate, useLocation } from 'react-router-dom'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { setDoc, serverTimestamp } from 'firebase/firestore'
import googleIcon from '../assets/svg/googleIcon.svg'
import { toast } from 'react-toastify'
import { userService } from '../services/user.service'

export const OAuth = () => {

    const navigate = useNavigate()
    const location = useLocation()


    const onGoogleClick = async () => {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const res = await signInWithPopup(auth, provider)
            const user = res.user

            const { docRef, docSnap } = await userService.getById(user.uid)

            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                })
            }
            navigate('/')
        } catch (error) {
            toast.error('Could not authorize in with Google')
        }
    }

    return (
        <div className="socialLogin">
            <p>{location.pathname === '/login' ? 'Login' : 'Signup'} with </p>
            <button className="socialIconDiv" onClick={onGoogleClick}>
                <img src={googleIcon} alt="google icon" className="socialIconImg" />
            </button>
        </div>
    )
}