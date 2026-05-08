import { useContext } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { toast } from 'react-toastify';

export default function Cart() {
    const { cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } = useContext(CartContext);

    if (cartItems.length === 0) {
        return (
            <section className="space-y-6 text-center">
                <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
                <div className="py-12 text-gray-600">
                    <p className="text-lg mb-4">Your cart is empty</p>
                    <Link to="/products" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        Continue Shopping
                    </Link>
                </div>
            </section>
        );
    }
    return (
        <section className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <article key={item.id} className="bg-white rounded-lg border border-gray-200 p-4 flex gap-4">
                            {/* Product Image */}
                            <div className="w-24 h-24 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-md" />
                                ) : (
                                    <span className="text-gray-400">No image</span>
                                )}
                            </div>

                            {/* Product Details */}
                            <div className="flex-grow">
                                <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                                <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                                <p className="text-lg font-bold text-blue-700">Rs. {item.price}</p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex flex-col items-end gap-3">
                                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="p-1 hover:bg-gray-200 rounded"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="p-1 hover:bg-gray-200 rounded"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <button
                                    onClick={() => {
                                        removeFromCart(item.id);
                                        toast.success("Item is removed from Cart successfully");
                                    }}
                                    className="text-red-500 hover:text-red-700 flex items-center gap-1"
                                >
                                    <Trash2 size={18} /> Remove
                                </button>
                                <p className="text-sm font-semibold text-gray-900">
                                    Subtotal: Rs. {(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
                    <h2 className="font-bold text-lg mb-4">Order Summary</h2>
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal:</span>
                            <span>Rs. {totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping:</span>
                            <span>Free</span>
                        </div>
                        <div className="border-t pt-3 flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span>Rs. {totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                    <Link to="/checkout/address" className="block text-center w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mb-2" >
                        Proceed to Checkout
                    </Link>
                    <button
                        onClick={clearCart}
                        className="w-full bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300"
                    >
                        Clear Cart
                    </button>
                </div>
            </div>
        </section>
    );
}