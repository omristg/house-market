import { Link } from "react-router-dom"
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg'
import bedIcon from '../assets/svg/bedIcon.svg'
import bathtubIcon from '../assets/svg/bathtubIcon.svg'

export const ListingPreview = ({ listing, id, onRemove }) => {

    const { name, location, imgUrls, type, offer, regularPrice,
        discountedPrice, bedrooms, bathrooms } = listing

    const formatPrice = (price) => {
        const options = { style: 'currency', currency: 'USD' }
        const formattedPrice = new Intl.NumberFormat('en-US', options).format(price)
        return formattedPrice
    }

    
    
    return (
        <li className="categoryListing">
            <Link to={`/category/${type}/${id}`}
                className="categoryListingLink"
            >
                <img src={imgUrls[0]} alt={name} className="categoryListingImg" />
                <div className="categoryListingDetails">
                    <p className="categoryListingLocation">{location}</p>
                    <p className="categoryListingName">{name}</p>
                    <p className="categoryListingPrice">
                        {offer ?
                            formatPrice(discountedPrice)
                            :
                            formatPrice(regularPrice)
                        }
                        {type === 'rent' && ' / Month'}
                    </p>
                    <div className="categoryListingInfoDiv">
                        <img src={bedIcon} alt="bed" />
                        <p className="categorylistingInfoText">
                            {bedrooms > 1 ? `${bedrooms} Bedrooms` : '1 Bedroom'}
                        </p>
                        <img src={bathtubIcon} alt="bathtub" />
                        <p className="categorylistingInfoText">
                            {bathrooms > 1 ? `${bathrooms} Bathrooms` : '1 Bathroom'}
                        </p>
                    </div>
                </div>
            </Link>

            {onRemove &&
                <DeleteIcon 
                className="removeIcon"
                fill="red"
                onClick={()=>onRemove(id, listing.namr)}
                 />
            }
        </li>
    )
}