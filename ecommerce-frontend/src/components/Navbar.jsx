// import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, LogOut } from 'lucide-react';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
    // useState is one of the hooks in react and this represents the management of state in functional components.
    // const [isOpen, setIsOpen] = useState(false); // mobile menu toggle

    //checks if user is logged in (stored in local storage)

    const { user, logout: logoutAuth} = useContext(AuthContext);
    const { totalItems } = useContext(CartContext);
    const isLoggedIn = !!user;

    //handle logout
    const handleLogout = () => {
        logoutAuth();
        window.location.href = '/';
    };

    return (
        <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50 " >
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

                {/* Logo & Brand */}
                <Link to="/" className="text-2xl font-bold">
                    🛍️ EcomHub
                </Link>

                {/* Desktop Menu (hidden on mobile) */}
                <div className="hidden md:flex gap-8 items-center">
                    <Link to="/" className="hover:text-blue-200 transition">Home</Link>
                    <Link to="/products" className="hover:text-blue-200 transition">Products</Link>

                    {/* Cart Icon */}
                    <Link to="/cart" className="relative hover:text-blue-200 transition">
                        <ShoppingCart size={24} />
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {totalItems}
                        </span>

                    </Link>

                    {/* Auth Links */}
                    {isLoggedIn ? (
                        <div className="flex gap-4 items-center">
                            <span className="text-sm">{user.fullName}</span>
                            <Link to="/profile" className="bg-blue-700 px-3 py-2 rounded hover:bg-blue-800">
                                Profile
                            </Link>
                            <button onClick={handleLogout} className="bg-red-500 px-3 py-2 rounded hover:bg-red-600 flex items-center gap-2">
                                <LogOut size={18} /> Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link to="/login" className="bg-green-500 px-4 py-2 rounded hover:bg-green-600">
                                Login
                            </Link>
                            <Link to="/register" className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-800">
                                Register
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                {/* <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden flex items-center gap-2"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button> */}
            </div>

            {/* Mobile Menu (appears when hamburger clicked) */}
            {/* {isOpen && (
                <div className="md:hidden bg-blue-700 px-4 py-4 space-y-3">
                    <Link to="/" className="block hover:text-blue-200">Home</Link>
                    <Link to="/products" className="block hover:text-blue-200">Products</Link>
                    <Link to="/cart" className="block hover:text-blue-200">Cart</Link>

                    {isLoggedIn ? (
                        <>
                            <Link to="/profile" className="block hover:text-blue-200">Profile</Link>
                            <button onClick={handleLogout} className="block w-full text-left text-red-300 hover:text-red-200">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="block hover:text-blue-200">Login</Link>
                            <Link to="/register" className="block hover:text-blue-200">Register</Link>
                        </>
                    )}
                </div>
            )} */}
        </nav>
    );
}