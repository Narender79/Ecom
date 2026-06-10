import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function OrderDetails() {
    const { orderId } = useParams(); // This will be the order database ID
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrderDetails() {
            try {
                const res = await api.get(`/orders/${orderId}`);
                setOrder(res.data.data);
            } catch (error) {
                console.error("Error fetching order details:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchOrderDetails();
    }, [orderId]);

    if (loading) {
        return <div className="text-center py-12 text-gray-600">Loading order details...</div>;
    }

    if (!order) {
        return (
            <div className="text-center py-12">
                <p className="text-lg text-gray-600 mb-4">Order not found.</p>
                <button
                    onClick={() => navigate("/profile")}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                    Back to Profile
                </button>
            </div>
        );
    }

    return (
        <section className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>

            <div className="space-y-2 border-b pb-4">
                <p><span className="font-semibold">Order Number:</span> {order.orderNumber}</p>
                <p><span className="font-semibold">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><span className="font-semibold">Total Amount:</span> ₹{order.total}</p>
                <p><span className="font-semibold">Status:</span> {order.status}</p>
            </div>

            <div className="space-y-3 pt-4">
                <h3 className="text-lg font-semibold text-gray-900">Items Ordered</h3>
                <ul className="divide-y divide-gray-200">
                    {order.items && order.items.map((item) => (
                        <li key={item.id} className="py-2 flex justify-between">
                            <div>
                                <p className="font-medium text-gray-800">{item.product.name}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-semibold text-blue-700">₹{item.price * item.quantity}</p>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="pt-6">
                <Link to="/profile" className="text-blue-600 hover:text-blue-700 font-medium">
                    &larr; Back to Profile
                </Link>
            </div>
        </section>
    );
}
