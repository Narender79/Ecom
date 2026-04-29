import { useContext } from "react";
import { useNavigate ,Link} from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Phone, Mail, HelpCircle } from "lucide-react";

export default function Profile() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const mockOrders = [
        {
            id: 1,
            orderNumber: "ORD-001",
            date: "2024-01-15",
            total: 5999,
            status: "Delivered",
            items: 3,
        },
        {
            id: 2,
            orderNumber: "ORD-002",
            date: "2024-01-20",
            total: 3499,
            status: "Processing",
            items: 2,
        },
        {
            id: 3,
            orderNumber: "ORD-003",
            date: "2024-02-05",
            total: 8999,
            status: "Delivered",
            items: 5,
        },
    ];

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    if (!user) {
        return (
            <div className="text-center py-12">
                <p className="text-lg text-gray-600 mb-4">Please log in to view your profile.</p>
                <button
                    onClick={() => navigate("/login")}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile Header */}
            <section className="bg-white p-8 rounded-xl shadow-md">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <p className="text-lg text-gray-900 mt-1">{user.fullName}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="text-lg text-gray-900 mt-1">{user.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
                >
                    Logout
                </button>
            </section>

            {/* Order History */}
            <section className="bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
                {mockOrders.length > 0 ? (
                    <div className="space-y-4">
                        {mockOrders.map((order) => (
                            <Link key={order.id} to={`/orders/${order.orderNumber}`} className="block">
                                <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                                            <p className="text-sm text-gray-600">Date: {order.date}</p>
                                            <p className="text-sm text-gray-600">{order.items} items</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-gray-900">₹{order.total}</p>
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${order.status === "Delivered"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">You haven't placed any orders yet.</p>
                )}
            </section>

            {/* Customer Care & Help */}
            <section className="bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Care & Support</h2>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                        <Phone className="text-blue-600 mt-1" size={24} />
                        <div>
                            <p className="font-semibold text-gray-900">Phone Support</p>
                            <p className="text-gray-600">+91-1800-ECOM-HUB</p>
                            <p className="text-sm text-gray-500">Available 24/7</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                        <Mail className="text-green-600 mt-1" size={24} />
                        <div>
                            <p className="font-semibold text-gray-900">Email Support</p>
                            <p className="text-gray-600">support@ecomhub.com</p>
                            <p className="text-sm text-gray-500">Response within 24 hours</p>
                        </div>
                    </div>
                </div>

                {/* FAQs */}
                <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <HelpCircle size={20} /> Frequently Asked Questions
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <p className="font-semibold text-gray-900">How do I track my order?</p>
                            <p className="text-gray-600 text-sm">You can track your order from the Order History section above. Click on any order to see detailed tracking information.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">What is the return policy?</p>
                            <p className="text-gray-600 text-sm">We offer a 30-day return policy on most items. Items must be unused and in original packaging.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">How long does shipping take?</p>
                            <p className="text-gray-600 text-sm">Standard shipping takes 5-7 business days. Express shipping is available for 2-3 day delivery.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Can I cancel my order?</p>
                            <p className="text-gray-600 text-sm">Orders can be cancelled within 2 hours of placement. Contact our support team for assistance.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}