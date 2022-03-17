import { Navigate, Outlet } from "react-router-dom"
import { useAuthStatus } from '../hooks/useAuthStatus'
import { Spinner } from '../cmps/shared/Spinner'

export const PrivateRoute = () => {
    const { loggedIn, checkingStatus } = useAuthStatus()


    if (checkingStatus) return <Spinner />

    return loggedIn ? <Outlet /> : <Navigate to="/signin" />
}