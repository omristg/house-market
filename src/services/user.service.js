import { collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../firebase.config'

export const userService = {
    update,
    getById,
}

async function getById(userId) {
    const docRef = doc(db, 'users', userId)
    const docSnap = await getDoc(docRef)
    return { docSnap, docRef }
}

async function update(userId, userToUpdate) {
    userToUpdate.timestamp = serverTimestamp()
    await setDoc(doc(db, 'users', userId), userToUpdate)
}


