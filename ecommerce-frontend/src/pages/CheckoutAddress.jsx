import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckoutAddress() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        const { fullName, phone, street, city, state, pincode } = formData;

        if (!fullName || !phone || !street || !city || !state || !pincode) {
            setError("Please full in all fields.");
            return;
        }

        localStorage.setItem("checkoutAddress", JSON.stringify(formData));
        navigate("/checkout/payment");
    }

    return (
        <section className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h1>

            {error && (
                <div className="mb-4 rounded-md bg-red-100 text-red-700 px-4 py-2 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full rounded-lg border px-4 py-2"
                />
                <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="w-full rounded-lg border px-4 py-2"
                />
                <input
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Street Address"
                    className="w-full rounded-lg border px-4 py-2"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="w-full rounded-lg border px-4 py-2"
                    />
                    <input
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="State"
                        className="w-full rounded-lg border px-4 py-2"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="Pincode"
                        className="w-full rounded-lg border px-4 py-2"
                    />
                    <input
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="Country"
                        className="w-full rounded-lg border px-4 py-2"
                    />
                </div>

                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    Continue to Payment
                </button>
            </form>
        </section>
    );
}