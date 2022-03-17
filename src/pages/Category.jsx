import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { collection, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import { Spinner } from '../cmps/shared/Spinner'
import { ListingPreview } from '../cmps/ListingPreview'
import { listingService } from "../services/listing.service"

export const Category = () => {

    const [listings, setListings] = useState([])
    const [loading, setLoading] = useState(true)

    const { categoryName } = useParams()

    useEffect(() => {
        const listingsRef = collection(db, 'listings')
        const q = query(listingsRef,
            where('type', '==', categoryName),
            orderBy('timestamp', 'desc'),
            limit(10)
        );
        (async () => {
            try {
                const listings = await listingService.query(q)
                setListings(listings)
                setLoading(false)
            } catch (error) {
                toast.error('Could not get listings')
            }
        })();
    }, [categoryName])

    return (
        <div className="category">
            <header>
                <p className="pageHeader">
                    Places for {categoryName === 'rent' ? 'rent' : 'sale'}
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
                <p>No listings for {categoryName}</p>
            }
        </div>
    )
}