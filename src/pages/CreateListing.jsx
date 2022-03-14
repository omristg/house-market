import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { Spinner } from '../cmps/Spinner'

export const CreateListing = () => {

    const [loading, setLoading] = useState(true)
    const [geoLocationEnabled, setGeoLocationEnabled] = useState(true)
    const [formData, setFormData] = useState({
        type: 'rent',
        name: '',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: '',
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0
    })

    const auth = getAuth()
    const navigate = useNavigate()
    const isMounted = useRef(true)

    useEffect(() => {
        if (isMounted) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setFormData({ ...formData, userRef: user.uid })
                    setLoading(false)
                } else navigate('signin')

            })
        }
        return () => {
            isMounted.current = false
        }
    }, [isMounted])

    if (loading) return <Spinner />

    return (
        <div className="">
            CreateListing works!
        </div>
    )
}