import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Explore } from './pages/Explore'
import { ForgotPassword } from './pages/ForgotPassword'
import { Offers } from './pages/Offers'
import { Signin } from './pages/Signin'
import { Signup } from './pages/Signup'
import { Profile } from "./pages/Profile"
import { Navbar } from "./cmps/Navbar"
import { PrivateRoute } from "./pages/PrivateRoute"


export const RootCmp = () => {

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Explore />} />
                    <Route path="/offers" element={<Offers />} />
                    <Route path="/signin" element={<Signin />} />
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