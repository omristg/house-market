import { Link } from "react-router-dom"
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg'
import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg'
import bedIcon from '../assets/svg/bedIcon.svg'
import bathtubIcon from '../assets/svg/bathtubIcon.svg'
import { listingService } from "../services/listing.service"

export const ListingPreview = ({ listing, onRemove, onEdit }) => {

    const { id, name, location, imgUrls, type, offer, regularPrice,
        discountedPrice, bedrooms, bathrooms } = listing

    return (
        <li className="listing-preview">
            <Link to={`/category/${type}/${id}`}>
                <img src={imgUrls[0]} alt={name} className="listing-image" />
                <div className="details-container">
                    <p className="location">{location}</p>
                    <p className="name">{name}</p>
                    <p className="price">
                        {offer ?
                            listingService.formattedPrice(discountedPrice)
                            :
                            listingService.formattedPrice(regularPrice)
                        }
                        {type === 'rent' && ' / Month'}
                    </p>
                    <div className="info-container">
                        <img src={bedIcon} alt="bed" />
                        <p className="text">
                            {bedrooms > 1 ? `${bedrooms} Bedrooms` : '1 Bedroom'}
                        </p>
                        <img src={bathtubIcon} alt="bathtub" />
                        <p className="text">
                            {bathrooms > 1 ? `${bathrooms} Bathrooms` : '1 Bathroom'}
                        </p>
                    </div>
                </div>
            </Link>

            {onRemove && (
                <DeleteIcon
                    className="removeIcon"
                    fill="red"
                    onClick={() => onRemove(id, name)}
                />
            )

            }
            {onEdit && (
                <EditIcon className="editIcon" onClick={() => onEdit(id)} />
            )}
        </li>
    )
}