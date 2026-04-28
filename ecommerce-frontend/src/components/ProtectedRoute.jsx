import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }){
    //check if token exists in localStorage
    const isLoggedIn = !!localStorage.getItem('token');

    //if logged in , show the page (children)
    // if not , redirect to login page

    return isLoggedIn ? children: <Navigate to="/login"/>
}