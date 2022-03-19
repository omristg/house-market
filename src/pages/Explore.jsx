import { Link } from 'react-router-dom'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'
import { ExploreSlider } from '../cmps/ExploreSlider'

export const Explore = () => {

    return (
        <div className="explore">
            <header>
                <p className="page-header">Explore</p>
            </header>

            <ExploreSlider />
            <main>
                <p className="category-heading">Categories</p>
                <div className="categories">
                    <Link to="/category/rent">
                        <img src={rentCategoryImage} alt="rent" />
                        <p>Places for rent</p>
                    </Link>
                    <Link to="/category/sale">
                        <img src={sellCategoryImage} alt="sell" />
                        <p>Places for sell</p>
                    </Link>
                </div>
            </main>
        </div>
    )
}