import { useEffect, useState } from "react"
import { collection, query, where, limit, startAfter } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import { Spinner } from '../cmps/shared/Spinner'
import { listingService } from "../services/listing.service"
import { ListingList } from "../cmps/ListingList"

export const Offers = () => {

    const [listings, setListings] = useState([])
    const [loading, setLoading] = useState(true)
    const [lastFetchListing, setLastFetchListing] = useState(null)

    useEffect(() => {
        (async () => {
            try {
                const listingsRef = collection(db, 'listings')
                const q = query(listingsRef,
                    where('offer', '==', true),
                    limit(5)
                )
                const { listings, lastVisible } = await listingService.query(q)
                setListings(listings)
                setLastFetchListing(lastVisible)
                setLoading(false)
            } catch (error) {
                toast.error('Could not get listings')
            }
        })();
    }, [])

    const onFetchMore = async () => {
        const listingsRef = collection(db, 'listings')
        const q = query(listingsRef,
            where('offer', '==', true),
            startAfter(lastFetchListing),
            limit(5)
        );
        (async () => {
            try {
                const { listings, lastVisible } = await listingService.query(q)
                setListings(prevState => [...prevState, ...listings])
                setLastFetchListing(lastVisible)
                setLoading(false)
            } catch (error) {
                toast.error('Could not get more listings')
            }
        })();
    }

    if (loading) return <Spinner />

    return (
        <ListingList
            listings={listings}
            lastFetchListing={lastFetchListing}
            onFetchMore={onFetchMore}
            isOffers={true}
        />
    )
}