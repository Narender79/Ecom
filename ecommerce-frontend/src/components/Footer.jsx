import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12 mt-16">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Brand Column */}
                <div>
                    <h3 className="text-2xl font-bold mb-4">🛍️ EcomHub</h3>
                    <p className="text-gray-400 text-sm">
                        Your one-stop shop for everything you need.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="font-bold mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><Link to="/" className="hover:text-white">Home</Link></li>
                        <li><Link to="/products" className="hover:text-white">Products</Link></li>
                        <li><Link to="/cart" className="hover:text-white">Cart</Link></li>
                        <li><a href="#" className="hover:text-white">Contact Us</a></li>
                    </ul>
                </div>

                {/* Customer Service */}
                <div>
                    <h4 className="font-bold mb-4">Customer Service</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><a href="#" className="hover:text-white">FAQs</a></li>
                        <li><a href="#" className="hover:text-white">Returns</a></li>
                        <li><a href="#" className="hover:text-white">Shipping</a></li>
                        <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
                    </ul>
                </div>

                {/* Social Media */}
                <div>
                    <h4 className="font-bold mb-4">Follow Us</h4>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-blue-400"><FaFacebook size={24} /></a>
                        <a href="#" className="hover:text-blue-400"><FaTwitter size={24} /></a>
                        <a href="#" className="hover:text-pink-400"><FaInstagram size={24} /></a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
                <p>&copy; 2026 EcomHub. All rights reserved.</p>
            </div>
        </footer>
    );
}