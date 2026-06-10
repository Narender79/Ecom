import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { Phone, Mail, HelpCircle } from "lucide-react";

export default function Profile() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        async function fetchOrders() {
            try {
                const res = await api.get("/orders");
                // res.data.data contains the list of orders from the backend
                setOrders(res.data.data || []);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, [user]);

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
                {loading ? (
                    <p className="text-gray-600">Loading order history...</p>
                ) : orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <Link key={order.id} to={`/orders/${order.id}`} className="block">
                                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                                            <p className="text-sm text-gray-600">
                                                Date: {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {order.items ? order.items.length : 0} items
                                            </p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                        <Phone className="text-blue-600 mt-1" size={24} />
                        <div>
                            <p className="font-semibold text-gray-900">Phone Support</p>
                            <p className="text-gray-600">+91-1800-ECOM-HUB</p>
                            <p className="sm text-gray-500">Available 24/7</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                        <Mail className="text-green-600 mt-1" size={24} />
                        <div>
                            <p className="font-semibold text-gray-900">Email Support</p>
                            <p className="text-gray-600">support@ecomhub.com</p>
                            <p className="sm text-gray-500">Response within 24 hours</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
