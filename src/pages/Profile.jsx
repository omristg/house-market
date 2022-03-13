import { getAuth, updateProfile } from 'firebase/auth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'

export const Profile = () => {

    const navigate = useNavigate()
    const auth = getAuth()

    const [changeDetails, setChangeDetails] = useState(false)
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })

    const handleChange = ({ target }) => {
        setFormData(prevState => ({
            ...prevState,
            [target.id]: target.value
        }))
    }

    const onLogout = async () => {
        await auth.signOut()
        navigate('/')

    }

    const onSubmit = async () => {
        if (auth.currentUser.displayName === name || !name) return
        try {
            await updateProfile(auth.currentUser, {
                displayName: name
            })

            const userRef = doc(db, 'users', auth.currentUser.uid)
            await updateDoc(userRef, { name })

        } catch (error) {
            toast.error('Could not update profile')
        }
    }

    const { name, email } = formData

    return (
        <div className='profile'>
            <header className="profileHeader">
                <p className="pageHeader">My Profile</p>
                <button className='logOut' onClick={onLogout}>Logout</button>
            </header>

            <main className="profileDetailsHeader">
                <p className="profileDeatilsText">Personal Details</p>
                <p className='changePersonalDetails' onClick={() => {
                    changeDetails && onSubmit()
                    setChangeDetails(prevState => !prevState)
                }}>
                    {changeDetails ? 'Done' : 'Change'}
                </p>
            </main>

            <div className="profileCard">
                <form>
                    <input type="text"
                        id="name"
                        className={!changeDetails ? 'profileName' : 'profileNameActive'}
                        disabled={!changeDetails}
                        value={name}
                        onChange={handleChange}
                        placeholder="Name"
                    />

                    <input type="text"
                        id="email"
                        className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
                        disabled={!changeDetails}
                        value={email}
                        onChange={handleChange}
                        placeholder={email}
                    />
                </form>
            </div>
        </div>
    )
}