import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getAuth, updateProfile } from 'firebase/auth'
import { collection, query, where, orderBy, updateDoc, doc } from 'firebase/firestore'
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
        const listingsRef = collection(db, 'listings')
        const q = query(listingsRef,
            where('userRef', '==', auth.currentUser.uid),
            orderBy('timestamp', 'desc')
        );
        (async () => {
            const { listings } = await listingService.query(q)
            setListings(listings)
            setLoading(false)
        })();
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
            const filteredListings = listings.filter(listing => listing.id !== listingId)
            setListings(filteredListings)
            toast.success('listing removed')
        } catch (error) {
            toast.error('Could not remove listing')
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
            <Link className="createListing" to="/create-listing">
                <img src={homeIcon} alt="home" />
                <p>Sell or rent your home </p>
                <img src={keyboardArrowRightIcon} alt="right arrow" />
            </Link>

            {!loading && listings.length > 0 && (
                <>
                    <p className="listingText">Your Listings</p>
                    <ul className="listingsList">
                        {listings.map(listing => (
                            <ListingPreview key={listing.id} listing={listing} onRemove={onRemove} />
                        ))}
                    </ul>
                </>
            )}

        </div>
    )
}