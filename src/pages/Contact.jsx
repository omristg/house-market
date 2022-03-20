import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import { userService } from "../services/user.service"

export const Contact = () => {

    const [landlord, setLandlord] = useState(null)
    const [message, setMessage] = useState('')
    // eslint-disable-next-line
    const [searchParams, setSearchParams] = useSearchParams()

    const { landlordId } = useParams()

    useEffect(() => {
        (async () => {
            const { docSnap } = await userService.getById(landlordId)
            if (docSnap.exists()) setLandlord(docSnap.data())
            else toast.error('Could not get landlord')
        })();
    }, [landlordId])

    return (
        <div className="page-container">
            <header>
                <p className="page-header">Contact Landlord</p>
            </header>

            {landlord && (
                <main>

                    <div className="contactLandlord">
                        <p className="landlordName">Contact {landlord.name}</p>
                    </div>

                    <form className="messageForm">
                        <div className="messageDiv">
                            <label htmlFor="message" className="messageLabel">
                                Message
                            </label>
                            <textarea
                                className="textarea"
                                id="message"
                                value={message}
                                onChange={(ev) => { setMessage(ev.target.value) }}
                            ></textarea>
                        </div>

                        <a href={`mailto:${landlord.email}
                            ?Subject=${searchParams.get('listingName')}
                            &body=${message}`}>
                            <button type="button" className="primaryButton">
                                Send Message
                            </button>
                        </a>
                    </form>
                </main>
            )}
        </div>
    )
}