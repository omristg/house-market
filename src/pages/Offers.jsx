import { useEffect, useState } from "react"
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import { Spinner } from '../cmps/Spinner'
import { ListingPreview } from '../cmps/ListingPreview'

export const Offers = () => {

    const [listings, setListings] = useState([])
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        (async () => {
            try {
                const listingsRef = collection(db, 'listings')

                const q = query(listingsRef,
                    where('offer', '==', true),
                    // orderBy('timestamp', 'desc'),
                    limit(10)
                )
                const querySnap = await getDocs(q)
                const listings = []
                querySnap.forEach(doc => {
                    listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                setListings(listings)
                setLoading(false)
            } catch (error) {
                toast.error('Could not get listings')
            }
        })();
    }, [])


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
                            const { id, data } = listing
                            return <ListingPreview key={id} listing={data} id={id} />

                        })}
                    </ul>
                </main>
                :
                <p>There are no offers avialable</p>
            }
        </div>
    )
}