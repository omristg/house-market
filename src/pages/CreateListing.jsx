import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { v4 as uuid } from 'uuid'
import { toast } from "react-toastify"
import { Spinner } from '../cmps/shared/Spinner'
import { ProgressBar } from "../cmps/shared/ProgressBar"
import { listingService } from "../services/listing.service"

const API_KEY = process.env.REACT_APP_GEOCODE_API_KEY

export const CreateListing = () => {


    const [progress, setProgress] = useState(false)
    const [loading, setLoading] = useState(true)
    const geolocationEnabled = true
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


    const { type, name, bedrooms, bathrooms, parking, furnished, address,
        offer, regularPrice, discountedPrice, images, latitude, longitude } = formData


    const auth = getAuth()
    const navigate = useNavigate()
    const isMounted = useRef(true)

    useEffect(() => {
        if (isMounted) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setFormData({ ...formData, userRef: user.uid })
                    setLoading(false)
                } else navigate('/login')

            })
        }
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [isMounted])



    const onSubmit = async (ev) => {
        ev.preventDefault()

        if (discountedPrice >= regularPrice) {
            setLoading(false)
            toast.error('Discounted price cannot be greater than regular price')
            return
        }
        if (images.length > 6) {
            setLoading(false)
            toast.error('Max 6 images')
            return
        }

        const geolocation = await handleLocation()


        const imgUrls = await Promise.all(
            [...images].map(image => storeImage(image))
        ).catch(() => {
            setLoading(false)
            toast.error('Images has not uploaded')
            return
        })

        const formDataCopy = {
            ...formData,
            imgUrls,
            geolocation,
        }

        formDataCopy.location = address
        delete formDataCopy.images
        delete formDataCopy.address
        !formDataCopy.offer && delete formDataCopy.discountedPrice

        const addedListing = await listingService.add(formDataCopy)
        setProgress(false)
        toast.success('Listing saved')
        navigate(`/category/${formDataCopy.type}/${addedListing.id}`)
    }

    const storeImage = async (image) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage()
            const fileName = `${auth.currentUser.uid}-${image.name}-${uuid()}`

            const storageRef = ref(storage, 'images/' + fileName)

            const uploadTask = uploadBytesResumable(storageRef, image)

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // eslint-disable-next-line
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setProgress(progress)
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL)
                    })
                }
            )
        })
    }

    const handleLocation = async () => {
        let geolocation = {}
        let location

        if (geolocationEnabled) {
            const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`)
            const data = await res.json()

            geolocation.lat = data.results[0]?.geometry.location.lat ?? 0
            geolocation.lng = data.results[0]?.geometry.location.lng ?? 0
            location = data.status === 'ZERO_RESULTS' ? undefined : data.results[0].formatted_address

            if (!location || location.includes('undefined')) {
                toast.error('Please enter  a correct address')
            }
        } else {
            geolocation.lat = latitude
            geolocation.lng = longitude
        }
        return geolocation
    }

    const onMutate = (ev) => {
        const { value, files, id } = ev.target
        let boolean;
        if (value === 'true') boolean = true
        if (value === 'false') boolean = false
        if (files) {
            setFormData(prevState => ({
                ...prevState,
                images: files
            }))
        }
        if (!files) {
            setFormData(prevState => ({
                ...prevState,
                [id]: boolean ?? value
            }))
        }

    }

    if (loading) return <Spinner />

    return (
        <div className="edit-listing">
        <header>
            <p className="page-header">Create a listing</p>
        </header>

        <main>
            <form onSubmit={onSubmit}>
                <label>Sell / Rent</label>
                <div className='flex'>
                    <button
                        type='button'
                        className={type === 'sale' ? 'active' : ''}
                        id='type'
                        value='sale'
                        onClick={onMutate}
                    >
                        Sell
                    </button>
                    <button
                        type='button'
                        className={type === 'rent' ? 'active' : ''}
                        id='type'
                        value='rent'
                        onClick={onMutate}
                    >
                        Rent
                    </button>
                </div>
                <label htmlFor="name">Name</label>
                <input
                    className='listing-name-input'
                    type='text'
                    id='name'
                    value={name}
                    onChange={onMutate}
                    maxLength='32'
                    minLength='10'
                    required
                />

                <div className='bedRooms flex'>
                    <div>
                        <label htmlFor="bedrooms">Bedrooms</label>
                        <input
                            className='small-input'
                            type='number'
                            id='bedrooms'
                            value={bedrooms}
                            onChange={onMutate}
                            min='1'
                            max='50'
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="bathrooms">Bathrooms</label>
                        <input
                            className='small-input'
                            type='number'
                            id='bathrooms'
                            value={bathrooms}
                            onChange={onMutate}
                            min='1'
                            max='50'
                            required
                        />
                    </div>

                </div>
                <label>Parking spot</label>
                <div className='flex'>
                    <button
                        className={parking ? 'active' : ''}
                        type='button'
                        id='parking'
                        value={true}
                        onClick={onMutate}
                        min='1'
                        max='50'
                    >
                        Yes
                    </button>
                    <button
                        className={!parking && parking !== null ? 'active' : ''}
                        type='button'
                        id='parking'
                        value={false}
                        onClick={onMutate}
                    >
                        No
                    </button>
                </div>

                <label>Furnished</label>
                <div className='flex'>
                    <button
                        className={furnished ? 'active' : ''}
                        type='button'
                        id='furnished'
                        value={true}
                        onClick={onMutate}
                    >
                        Yes
                    </button>
                    <button
                        className={!furnished && furnished !== null ? 'active' : ''}
                        type='button'
                        id='furnished'
                        value={false}
                        onClick={onMutate}
                    >
                        No
                    </button>
                </div>

                <label htmlFor="address">Address</label>
                <textarea
                    className='address-input'
                    type='text'
                    id='address'
                    value={address}
                    onChange={onMutate}
                    required
                />

                {!geolocationEnabled && (
                    <div className='formLatLng flex'>
                        <div>
                            <label>Latitude</label>
                            <input
                                className='small-input'
                                type='number'
                                id='latitude'
                                value={latitude}
                                onChange={onMutate}
                                required
                            />
                        </div>
                        <div>
                            <label>Longitude</label>
                            <input
                                className='small-input'
                                type='number'
                                id='longitude'
                                value={longitude}
                                onChange={onMutate}
                                required
                            />
                        </div>
                    </div>
                )}

                <label>Offer</label>
                <div className='flex'>
                    <button
                        className={offer ? 'active' : ''}
                        type='button'
                        id='offer'
                        value={true}
                        onClick={onMutate}
                    >
                        Yes
                    </button>
                    <button
                        className={
                            !offer && offer !== null ? 'active' : ''
                        }
                        type='button'
                        id='offer'
                        value={false}
                        onClick={onMutate}
                    >
                        No
                    </button>
                </div>

                <label>Regular Price</label>
                <div className='price-container'>
                    <input
                        className='small-input'
                        type='number'
                        id='regularPrice'
                        value={regularPrice}
                        onChange={onMutate}
                        min='50'
                        max='750000000'
                        required
                    />
                    {type === 'rent' && <p>$ / Month</p>}
                </div>

                {offer && (
                    <>
                        <label>Discounted Price</label>
                        <input
                            className='small-input'
                            type='number'
                            id='discountedPrice'
                            value={discountedPrice}
                            onChange={onMutate}
                            min='50'
                            max='750000000'
                            required={offer}
                        />
                    </>
                )}

                <label>Images</label>
                <p className='upload-info'>
                    The first image will be the cover (max 6).
                </p>
                <input
                    type='file'
                    id='images'
                    onChange={onMutate}
                    max='6'
                    accept='.jpg,.png,.jpeg'
                    multiple
                    required
                />
                <button type='submit' className='btn-primary createListingButton'>
                    Create listing
                </button>
            </form>
            {progress !== false && (
                <ProgressBar percentage={progress} />
            )}
        </main>
    </div>
    )
}