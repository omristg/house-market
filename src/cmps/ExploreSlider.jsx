import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css';
import { listingService } from '../services/listing.service';
import { db } from '../firebase.config';
import { Spinner } from './shared/Spinner';

export const ExploreSlider = () => {

    const navigate = useNavigate()

    const [listings, setListings] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            const listingsRef = collection(db, 'listings')
            const q = query(listingsRef,
                orderBy('timestamp', 'desc'),
                limit(10)
            )
            const { listings } = await listingService.query(q)
            setListings(listings)
            setLoading(false)
        })();
    }, [])


    if (loading) return <Spinner />

    return (
        <div className="explore-slider">
            <p className="heading">Recommended</p>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                slidesPerView={1}
                autoplay={true}
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                style={{ cursor: 'pointer' }}
            >
                {listings.map(listing => {
                    const { id, name, imgUrls, type, regularPrice, discountedPrice } = listing
                    const priceToFormat = discountedPrice ?? regularPrice
                    const price = listingService.formattedPrice(priceToFormat)
                    return (
                        <SwiperSlide
                            key={id}
                            onClick={() => navigate(`/category/${type}/${id}`)}
                        >
                            <div className="slides-container">
                                <p className="text">{name}</p>
                                <p className="price">
                                    {price}{type === 'rent' && ' / Month'}
                                </p>
                            </div>
                            <img src={imgUrls[0]} alt="House pictures" style={{ width: '100%' }} className="slides-img"/>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
        </div>
    )
}