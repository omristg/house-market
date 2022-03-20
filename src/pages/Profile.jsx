import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getAuth, updateProfile } from 'firebase/auth'
import { collection, query, where, orderBy, updateDoc, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import keyboardArrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import { listingService } from '../services/listing.service'
import { ListingPreview } from '../cmps/ListingPreview'

export const Profile = () => {

    const navigate = useNavigate()
    const auth = getAuth()

    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState([])
    const [changeDetails, setChangeDetails] = useState(false)
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })

    useEffect(() => {
        const q = query(collection(db, 'listings'),
            where('userRef', '==', auth.currentUser.uid),
            orderBy('timestamp', 'desc')
        )
        const unsub = onSnapshot(q, (querySnap) => {
            const listings = []
            querySnap.forEach(doc => {
                listings.push({ id: doc.id, ...doc.data() })
            })
            setListings(listings)
            setLoading(false)
        })
        return () => {
            unsub()
        }
    }, [auth.currentUser.uid])

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

    const onRemove = async (listingId) => {
        if (!window.confirm('Are you sure you want to remove this?')) return
        try {
            await listingService.remove(listingId)
            toast.success('listing removed')
        } catch (error) {
            toast.error('Could not remove listing')
        }

    }

    const onEdit = (listingId) => {
        navigate(`/edit-listing/${listingId}`)
    }

    const { name, email } = formData


    return (
        <div className='profile'>
            <header>
                <p className="page-header">My Profile</p>
                <button className='btn-logout' onClick={onLogout}>Logout</button>
            </header>

            <section className="change-details-section">
                <p>Personal Details</p>
                <p className='btn' onClick={() => {
                    changeDetails && onSubmit()
                    setChangeDetails(prevState => !prevState)
                }}>
                    {changeDetails ? 'Done' : 'Change'}
                </p>
            </section>

            <div className="card">
                <form>
                    <input type="text"
                        id="name"
                        className={`name ${!changeDetails ? '' : 'active'}`}
                        disabled={!changeDetails}
                        value={name}
                        onChange={handleChange}
                        placeholder="Name"
                    />

                    <input type="text"
                        id="email"
                        className={`email ${!changeDetails ? '' : 'active'}`}
                        disabled={!changeDetails}
                        value={email}
                        onChange={handleChange}
                        placeholder={email}
                    />

                </form>
            </div>
            <Link className="create-listing" to="/create-listing">
                <img src={homeIcon} alt="home" />
                <p>Sell or rent your home </p>
                <img src={keyboardArrowRightIcon} alt="right arrow" />
            </Link>

            {!loading && listings.length > 0 && (
                <div className="listing-list">
                    <p className="listings-header">Your Listings</p>
                    <ul>
                        {listings.map(listing => (
                            <ListingPreview key={listing.id} listing={listing} onRemove={onRemove} onEdit={onEdit} />
                        ))}
                    </ul>
                </div>
            )}

        </div>
    )
}