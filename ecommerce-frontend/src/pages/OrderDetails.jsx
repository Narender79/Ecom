import { useParams, Link, useNavigate } from 'react-router-dom';

export default function OrderDetails() {

    const { orderId } = useParams();
    const navigate = useNavigate();

    const mockOrders = [
        { orderNumber: "ORD-001", date: "2024-01-15", total: 5999, status: "Delivered", items: 3 },
        { orderNumber: "ORD-002", date: "2024-01-20", total: 3499, status: "Processing", items: 2 },
        { orderNumber: "ORD-003", date: "2024-02-05", total: 8999, status: "Delivered", items: 5 },
    ];

    const order = mockOrders.find((o) => o.orderNumber === orderId);

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

            <div className="space-y-2">
                <p><span className="font-semibold">Order:</span> {order.orderNumber}</p>
                <p><span className="font-semibold">Date:</span> {order.date}</p>
                <p><span className="font-semibold">Items:</span> {order.items}</p>
                <p><span className="font-semibold">Total:</span> ₹{order.total}</p>
                <p><span className="font-semibold">Status:</span> {order.status}</p>
            </div>

            <Link to="/profile" className="text-blue-600 hover:text-blue-700 font-medium">
                Back to Profile
            </Link>
        </section>
    );
}