import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";

export default function CheckoutPayment() {
    const navigate = useNavigate();
    const { clearCart } = useContext(CartContext);
    const [method, setMethod] = useState("cod");
    const [loading, setLoading] = useState(false);

    const handlePlaceOrder = async () => {
        const addressData = localStorage.getItem("checkoutAddress");
        if (!addressData) {
            toast.error("Shipping address not found. Please enter it first.");
            navigate("/checkout/address");
            return;
        }

        setLoading(true);
        try {
            const address = JSON.parse(addressData);
            // Post order address details to backend
            await api.post("/orders", address);

            // Cleanup local state on success
            localStorage.removeItem("checkoutAddress");
            clearCart();
            toast.success("Order placed successfully!");
            navigate("/profile");
        } catch (error) {
            console.error("Error placing order:", error);
            toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Payment Method</h1>

            <div className="space-y-3">
                <label className="flex items-center gap-3">
                    <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={method === "cod"}
                        onChange={() => setMethod("cod")}
                        disabled={loading}
                    />
                    Cash on Delivery
                </label>
                <label className="flex items-center gap-3">
                    <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={method === "card"}
                        onChange={() => setMethod("card")}
                        disabled={loading}
                    />
                    Card (Mock)
                </label>
                <label className="flex items-center gap-3">
                    <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={method === "upi"}
                        onChange={() => setMethod("upi")}
                        disabled={loading}
                    />
                    UPI (Mock)
                </label>
            </div>

            <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {loading ? "Placing Order..." : "Place Order"}
            </button>
        </section>
    );
}
