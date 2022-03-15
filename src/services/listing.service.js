import { doc, getDocs } from 'firebase/firestore'
import { db } from '../firebase.config'

export const listingService = {
    formattedPrice,
    query
}

async function query(query) {
    const querySnap = await getDocs(query)
    const listings = []
    querySnap.forEach(doc => {
        listings.push({
            id: doc.id,
            ...doc.data()
        })
    })
    return listings
}

function formattedPrice(price) {
    const options = { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }
    return new Intl.NumberFormat('en-US', options).format(price)
}