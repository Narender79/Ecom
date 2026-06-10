import { createContext, useState, useCallback, useEffect, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [isAuthenticated] = useContext(AuthContext);

    // Fetch the database cart from backend when user is authenticated
    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) {
            setCartItems([]);
            return;
        }
        try {
            const res = await api.get("/cart");
            // res.data.data contains our flattened array of product items
            setCartItems(res.data.data || []);

        } catch (error) {
            console.error("Error fetching cart from backend: ", error);
        }
    }, [isAuthenticated]);
    // Re-load the cart whenever authentication state changes

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = useCallback(async (product) => {
        if (!isAuthenticated) {
            // Local fallback if not logged in
            setCartItems((prev) => {
                const existing = prev.find((item) => item.id === product.id);
                if (existing) {
                    // if product already in cart , increase quantity
                    return prev.map((item) =>
                        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                }
                return [...prev, { ...product, quantity: 1 }];
            });
            return;
        }

        try {
            await api.post("/cart", { productId: product.id, quantity: 1 });
            fetchCart(); // Refresh state from database
        } catch (error) {
            console.error("error adding to cart:", error);
        }
    }, [isAuthenticated, fetchCart]);

    //remove item from cart entirely
    const removeFromCart = useCallback(async (productId) => {
        if (!isAuthenticated) {
            setCartItems((prev) => prev.filter((item) => item.id !== productId));
            return;
        }
        try {
            await api.delete(`/cart/${productId}`);
            fetchCart();
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    }, [isAuthenticated, fetchCart]);

    //update quantity of item

    const updateQuantity = useCallback(async (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
        }
        if (!isAuthenticated) {
            setCartItems((prev) =>
                prev.map((item) => item.id === productId ? { ...item, quantity } : item)
            );
            return;
        }

        try {
            await api.put(`/cart/${productId}`, { quantity });
            fetchCart();
        } catch (error) {
            console.error("Error updating quantity", error);
        }
    }, [isAuthenticated, removeFromCart, fetchCart]);

    // clear entire cart
    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    //calculate total price
    const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}