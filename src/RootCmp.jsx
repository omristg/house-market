import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { Explore } from './pages/Explore'
import { ForgotPassword } from './pages/ForgotPassword'
import { Offers } from './pages/Offers'
import { Signin } from './pages/Signin'
import { Signup } from './pages/Signup'
import { Navbar } from "./cmps/Navbar"


export const RootCmp = () => {

    return (
        <div className="app">
            <Router>
                <Routes>
                    <Route path="/" element={<Explore />} />
                    <Route path="/offers" element={<Offers />} />
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                </Routes>
                <Navbar />
            </Router>
        </div>
    )
}