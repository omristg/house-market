import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import { Spinner } from '../cmps/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
import { listingService } from '../services/listing.service'

export const ListingDetails = () => {

    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [shareLinkCopied, setShareLinkCopied] = useState(null)

    // eslint-disable-next-line
    const navigate = useNavigate()
    const { listingId } = useParams()
    const auth = getAuth()

    useEffect(() => {
        (async () => {
            const docRef = doc(db, 'listings', listingId)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setListing(docSnap.data())
                setLoading(false)
            }
        })();
    }, [listingId])

    const handleShare = () => {
        setShareLinkCopied(true)
        navigator.clipboard.writeText(window.location.href)
        setTimeout(() => {
            setShareLinkCopied(false)
        }, 2000)
    }

    if (loading) return <Spinner />

    const { name, location, type, offer, regularPrice,
        discountedPrice, bedrooms, bathrooms, parking, furnished, userRef } = listing

    return (
        <main>
            {/* Slider */}
            <div className="shareIconDiv" onClick={handleShare}>
                <img src={shareIcon} alt="share icon" />
            </div>

            {shareLinkCopied && (
                <p className="linkCopied">Link copied!</p>
            )}

            <div className="listingDetails">
                <p className="listingName">
                    {name} - {offer ?
                        listingService.formattedPrice(discountedPrice)
                        :
                        listingService.formattedPrice(regularPrice)
                    }
                </p>
                <p className="listingLocation">{location}</p>
                <p className="listingType">
                    For {type === 'rent' ? 'rent' : 'sale'}
                </p>
                {offer && (
                    <p className="discountPrice">
                        {listingService.formattedPrice(regularPrice - discountedPrice)} discount
                    </p>
                )}
                <ul className="listingDetailsList">
                    <li >
                        {bedrooms > 1 ? `${bedrooms} Bedrooms` : '1 Bedroom'}
                    </li>
                    <li >
                        {bathrooms > 1 ? `${bathrooms} Bathrooms` : '1 Bathroom'}
                    </li>
                    {parking && <li>Parking spot</li>}
                    {furnished && <li>Furnished</li>}

                </ul>
                <p className="listingLocationTitle">Location</p>

                {auth.currentUser?.uid !== userRef && (
                    <Link className='primaryButton'
                        to={`/contact/${userRef}?listingName=${name}`}
                    >
                        Contact landlord
                    </Link>
                )}
            </div>

        </main>
    )
}