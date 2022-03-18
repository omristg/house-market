import { doc, getDocs, getDoc, addDoc, deleteDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../firebase.config'

export const listingService = {
    formattedPrice,
    query,
    getbyid,
    add,
    remove,
    edit
}

async function query(query) {
    const querySnap = await getDocs(query)
    const listings = []
    querySnap.forEach(doc => (
        listings.push({
            id: doc.id,
            ...doc.data()
        })
    ))
    const lastVisible = querySnap.docs[querySnap.docs.length - 1]
    return { listings, lastVisible }

}

async function getbyid(listingId) {
    const docRef = doc(db, 'listings', listingId)
    const docSnap = await getDoc(docRef)
    const listing = docSnap.data()
    if (docSnap.exists()) return listing
    else throw new Error('Could not load listing')
}

async function add(listingToAdd) {
    listingToAdd.timestamp = serverTimestamp()
    const addedListing = await addDoc(collection(db, 'listings'), listingToAdd)
    return addedListing
}

async function edit(listingToEdit) {
    // listingToEdit.timestamp = serverTimestamp()
    const addedListing = await updateDoc(doc(db, 'listings', listingToEdit.id), listingToEdit)
    // return addedListing
}

async function remove(listingId) {
    await deleteDoc(doc(db, 'listings', listingId))
}

function formattedPrice(price) {
    const options = { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }
    return new Intl.NumberFormat('en-US', options).format(price)
}