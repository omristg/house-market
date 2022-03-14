import { useNavigate, useLocation } from 'react-router-dom'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import googleIcon from '../assets/svg/googleIcon.svg'
import { toast } from 'react-toastify'

export const OAuth = () => {

    const navigate = useNavigate()
    const location = useLocation()


    const onGoogleClick = async () => {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const res = await signInWithPopup(auth, provider)
            const user = res.user

            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)

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
            <p>Sign {location.pathname === '/signin' ? 'In' : 'Up'} with </p>
            <button className="socialIconDiv" onClick={onGoogleClick}>
                <img src={googleIcon} alt="google icon" className="socialIconImg" />
            </button>
        </div>
    )
}