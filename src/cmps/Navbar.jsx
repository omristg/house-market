import { useNavigate, useLocation } from 'react-router-dom'
import { ReactComponent as LocalOfferIcon } from "../assets/svg/localOfferIcon.svg"
import { ReactComponent as ExploreIcon } from "../assets/svg/exploreIcon.svg"
import { ReactComponent as PersonOutlineIcon } from "../assets/svg/personOutlineIcon.svg"
export const Navbar = () => {

    const navigate = useNavigate()
    const location = useLocation()

    const pathMatchRoute = (route) => {
        if (route === location.pathname)
            return true
    }

    return (
        <footer className="navbar">
            <nav>
                <ul>
                    <li>
                        <ExploreIcon fill={pathMatchRoute('/') ? "#2c2c2c" : "#8c8c8c"} width="36px" height="36px"
                            onClick={() => navigate('/')} />
                        <p className={pathMatchRoute('/') ? 'nav-item-active' : 'nav-item'}>Explore</p>
                    </li>
                    <li>
                        <LocalOfferIcon fill={pathMatchRoute('/offers') ? "#2c2c2c" : "#8c8c8c"} width="36px" height="36px"
                            onClick={() => navigate('/offers')} />
                        <p className={pathMatchRoute('/offers') ? 'nav-item-active' : 'nav-item'}>Offers</p>
                    </li>
                    <li>
                        <PersonOutlineIcon fill={pathMatchRoute('/profile') ? "#2c2c2c" : "#8c8c8c"} width="36px" height="36px"
                            onClick={() => navigate('/profile')} />
                        <p className={pathMatchRoute('/profile') ? 'nav-item-active' : 'nav-item'}>Profile</p>
                    </li>
                </ul>
            </nav >
        </footer >
    )
}