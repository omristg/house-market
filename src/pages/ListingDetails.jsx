import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getAuth } from 'firebase/auth'
import { Spinner } from '../cmps/shared/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css';
import { listingService } from '../services/listing.service'
import { toast } from 'react-toastify'

const mapAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const mapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

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
            try {
                const listing = await listingService.getbyid(listingId)
                setListing(listing)
                setLoading(false)
            } catch (error) {
                console.log(error);
                toast.error('Could not get listing')
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

    const { name, location, type, offer, regularPrice, geolocation, imgUrls,
        discountedPrice, bedrooms, bathrooms, parking, furnished, userRef } = listing

    return (
        <main>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                slidesPerView={1}
                navigation={{ clickable: true }}
                autoplay={true}
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
            >
                {imgUrls.map((url, idx) => (
                    <SwiperSlide key={idx}>
                        <img src={url} alt="House pictures" style={{ width: '100%' }} />
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="share-icon-container" onClick={handleShare}>
                <img src={shareIcon} alt="share icon" />
            </div>

            {
                shareLinkCopied && (
                    <p className="link-copied">Link copied!</p>
                )
            }

            <div className="listing-details">
                <p className="name">
                    {name} - {offer ?
                        listingService.formattedPrice(discountedPrice)
                        :
                        listingService.formattedPrice(regularPrice)
                    }
                </p>
                <p className="location">{location}</p>
                <p className="type">
                    For {type === 'rent' ? 'rent' : 'sale'}
                </p>
                {offer && (
                    <p className="price">
                        {listingService.formattedPrice(regularPrice - discountedPrice)} discount
                    </p>
                )}
                <ul className="info-list">
                    <li >
                        {bedrooms > 1 ? `${bedrooms} Bedrooms` : '1 Bedroom'}
                    </li>
                    <li >
                        {bathrooms > 1 ? `${bathrooms} Bathrooms` : '1 Bathroom'}
                    </li>
                    {parking && <li>Parking spot</li>}
                    {furnished && <li>Furnished</li>}

                </ul>
                <p className="location-title">Location</p>

                <div className="map-container">
                    <MapContainer
                        style={{ width: '100%', height: '100%' }}
                        center={geolocation}
                        zoom={14}
                        scrollWheelZoom={false}
                    >
                        <TileLayer
                            attribution={mapAttribution}
                            url={mapUrl}
                        />
                        <Marker position={geolocation}>
                            <Popup>
                                {location}
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>

                {auth.currentUser?.uid !== userRef && (
                    <Link className='btn-primary'
                        to={`/contact/${userRef}?listingName=${name}`}
                    >
                        Contact landlord
                    </Link>
                )}
            </div>

        </main >
    )
}