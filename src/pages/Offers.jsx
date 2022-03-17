import { useEffect, useState } from "react"
import { collection, query, where, limit, startAfter } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import { Spinner } from '../cmps/shared/Spinner'
import { ListingPreview } from '../cmps/ListingPreview'
import { listingService } from "../services/listing.service"

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
                    // orderBy('timestamp', 'desc'),
                    limit(2)
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
            limit(1)
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

    return (
        <div className="category">
            <header>
                <p className="pageHeader">
                    Offers
                </p>
            </header>
            {loading ? <Spinner /> : listings && listings.length > 0 ?
                <main>
                    <ul className="categoryListings">
                        {listings.map(listing => {
                            const { id } = listing
                            return <ListingPreview key={id} listing={listing} id={id} />

                        })}
                    </ul>
                </main>
                :
                <p>There are no offers avialable</p>
            }
            {lastFetchListing && (
                <p className="loadMore" onClick={onFetchMore}>Load More</p>
            )}
        </div>
    )
}