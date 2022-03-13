import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import { Spinner } from '../cmps/Spinner'
import { ListingPreview } from '../cmps/ListingPreview'

export const Category = () => {

    const [listings, setListings] = useState([])
    const [loading, setLoading] = useState(true)

    const { categoryName } = useParams()

    useEffect(() => {
        (async () => {
            try {
                const listingsRef = collection(db, 'listings')

                const q = query(listingsRef,
                    where('type', '==', categoryName),
                    orderBy('timestamp', 'desc'),
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
                            const { id, data } = listing
                            return <ListingPreview key={id} listing={data} id={id} />

                        })}
                    </ul>
                </main>
                :
                <p>No listings for {categoryName}</p>
            }
        </div>
    )
}