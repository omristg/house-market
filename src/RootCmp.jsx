import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Explore } from './pages/Explore'
import { ForgotPassword } from './pages/ForgotPassword'
import { Offers } from './pages/Offers'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Profile } from "./pages/Profile"
import { PrivateRoute } from "./pages/PrivateRoute"
import { Category } from "./pages/Category"
import { Navbar } from "./cmps/Navbar"
import { CreateListing } from "./pages/CreateListing"
import { ListingDetails } from './pages/ListingDetails'
import { Contact } from "./pages/Contact"
import { EditListing } from "./pages/EditListing"

export const RootCmp = () => {

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Explore />} />
                    <Route path="/offers" element={<Offers />} />
                    <Route path="/category/:categoryName" element={<Category />} />
                    <Route path="/create-listing" element={<CreateListing />} />
                    <Route path="/edit-listing/:listingId" element={<EditListing />} />
                    <Route path="/category/:categoryName/:listingId" element={<ListingDetails />} />
                    <Route path="/contact/:landlordId" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/profile" element={<PrivateRoute />}>
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                </Routes>
                <Navbar />
            </Router>
            <ToastContainer />
        </>
    )
}