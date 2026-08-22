import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

// Helper to load Razorpay SDK script dynamically
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function CheckoutPayment() {
    const navigate = useNavigate();
    const { clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
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
            
            if (method === "cod") {
                const payload = {
                    ...address,
                    paymentMethod: "COD"
                };
                await api.post("/orders", payload);
                localStorage.removeItem("checkoutAddress");
                clearCart();
                toast.success("Order placed successfully via Cash on Delivery!");
                navigate("/profile");
            } else if (method === "razorpay") {
                // 1. Load Razorpay Checkout Script
                const isLoaded = await loadRazorpayScript();
                if (!isLoaded) {
                    toast.error("Failed to load Razorpay SDK. Check your internet connection.");
                    setLoading(false);
                    return;
                }
                const payload = {
                    ...address,
                    paymentMethod: "RAZORPAY"
                };
                
                // 2. Create pending order on backend to get Razorpay order parameters
                const response = await api.post("/orders", payload);
                if (response.data.success) {
                    const { id, razorpayOrderId, amount, keyId } = response.data.data;
                    
                    // 3. Configure Razorpay modal options
                    const options = {
                        key: keyId,
                        amount: amount, // amount in paise
                        currency: "INR",
                        name: "Narender E-Commerce",
                        description: `Payment for Order #${id}`,
                        order_id: razorpayOrderId,
                        handler: async function (paymentResponse) {
                            setLoading(true);
                            try {
                                const verificationPayload = {
                                    razorpayOrderId: paymentResponse.razorpay_order_id,
                                    razorpayPaymentId: paymentResponse.razorpay_payment_id,
                                    razorpaySignature: paymentResponse.razorpay_signature
                                };
                                
                                // 4. Request backend to verify payment signature
                                const verifyRes = await api.post(`/orders/${id}/verify-payment`, verificationPayload);
                                if (verifyRes.data.success) {
                                    localStorage.removeItem("checkoutAddress");
                                    clearCart();
                                    toast.success("Payment successful! Order placed.");
                                    navigate("/profile");
                                } else {
                                    toast.error("Payment verification failed.");
                                }
                            } catch (err) {
                                console.error("Payment verification failed:", err);
                                toast.error("Verification failed. Please contact support.");
                            } finally {
                                setLoading(false);
                            }
                        },
                        prefill: {
                            name: user?.fullName || "",
                            email: user?.email || "",
                            contact: address.phone || ""
                        },
                        theme: {
                            color: "#2563EB" // Sleek brand blue
                        },
                        modal: {
                            ondismiss: function () {
                                toast.warn("Payment cancelled.");
                                setLoading(false);
                            }
                        }
                    };
                    const rzp = new window.Razorpay(options);
                    rzp.open();
                } else {
                    toast.error(response.data.message || "Failed to initiate payment.");
                }
            }
        } catch (error) {
            console.error("Error processing checkout:", error);
            toast.error(error.response?.data?.message || "Failed to process checkout. Please try again.");
        } finally {
            if (method !== "razorpay") {
                setLoading(false);
            }
        }
    };

    return (
        <section className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Payment Method</h1>
            <div className="space-y-3">
                {/* COD Card */}
                <label className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-all select-none">
                    <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={method === "cod"}
                        onChange={() => setMethod("cod")}
                        disabled={loading}
                        className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <div>
                        <span className="font-semibold text-gray-800">Cash on Delivery</span>
                        <p className="text-xs text-gray-500">Pay cash upon delivery of items.</p>
                    </div>
                </label>
                
                {/* Razorpay Card */}
                <label className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-all select-none">
                    <input
                        type="radio"
                        name="payment"
                        value="razorpay"
                        checked={method === "razorpay"}
                        onChange={() => setMethod("razorpay")}
                        disabled={loading}
                        className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <div>
                        <span className="font-semibold text-gray-800">Pay Online via Razorpay</span>
                        <p className="text-xs text-gray-500">Fast and secure payments via Cards, UPI, Netbanking, or Wallets.</p>
                    </div>
                </label>
            </div>
            <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold shadow-md transition-colors"
            >
                {loading ? "Processing..." : method === "cod" ? "Place Order (COD)" : "Pay Now with Razorpay"}
            </button>
        </section>
    );
}
