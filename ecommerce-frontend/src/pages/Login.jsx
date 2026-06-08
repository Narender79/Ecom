import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { toast } from "react-toastify";

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev, [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.email || !formData.password) {
            setError("Please fill in both fields.");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post("/auth/login", {
                email: formData.email,
                password: formData.password
            });

            if (response.data.success) {
                const { token, user } = response.data.data;
                login(token, user);
                toast.success("Successfully logged in!");
                navigate("/");
            } else {
                setError(response.data.message || "Invalid credentials.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Login</h1>

            {error && (
                <div className="mb-4 rounded-md bg-red-100 text-red-700 px-4 py-2 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="you@example.com"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <div className="text-sm text-center mt-4">
                <p className="text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign Up
                    </Link>
                </p>
            </div>
        </section>
    );
}