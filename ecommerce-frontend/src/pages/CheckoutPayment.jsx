import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckoutPayment() {
    const navigate = useNavigate();
    const [method, setMethod] = useState("cod");

    const handlePlaceOrder = () => {
        //mock placing order

        localStorage.removeItem("checkoutAddress");
        navigate("/profile");
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
                    />
                    UPI (Mock)
                </label>
            </div>

            <button
                onClick={handlePlaceOrder}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
                Place Order
            </button>
        </section>
    );
}