import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { collection, query, where, orderBy, limit, startAfter, onSnapshot, doc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import { Spinner } from '../cmps/shared/Spinner'
import { listingService } from "../services/listing.service"
import { ListingList } from "../cmps/ListingList"

export const Category = () => {

    const [listings, setListings] = useState([])
    const [lastFetchListing, setLastFetchListing] = useState(null)
    const [loading, setLoading] = useState(true)

    const { categoryName } = useParams()

    useEffect(() => {
        const listingsRef = collection(db, 'listings')
        const q = query(listingsRef,
            where('type', '==', categoryName),
            orderBy('timestamp', 'desc'),
            limit(5)
        );
        (async () => {
            try {
                const { listings, lastVisible } = await listingService.query(q)
                setListings(listings)
                setLastFetchListing(lastVisible)
                setLoading(false)
            } catch (error) {
                toast.error('Could not get listings')
            }
        })();
    }, [categoryName])

    const onFetchMore = async () => {
        const listingsRef = collection(db, 'listings')
        const q = query(listingsRef,
            where('type', '==', categoryName),
            orderBy('timestamp', 'desc'),
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
            categoryName={categoryName}
        />
    )
}