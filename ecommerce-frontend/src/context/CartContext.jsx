import { createContext, useState, useCallback, useEffect, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const { isAuthenticated } = useContext(AuthContext);

    // Save guest cart to localStorage whenever cart changes and user is not logged in
    useEffect(() => {
        if (!isAuthenticated) {
            localStorage.setItem("guestCart", JSON.stringify(cartItems));
        }
    }, [cartItems, isAuthenticated]);

    // Load guest cart when user is not logged in
    useEffect(() => {
        if (!isAuthenticated) {
            const savedGuestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
            setCartItems(savedGuestCart);
        }
    }, [isAuthenticated]);  

    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) {
            const savedGuestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
            setCartItems(savedGuestCart);
            return;
        }
        try {
            const res = await api.get("/cart");
            setCartItems(res.data.data || []);
        } catch (error) {
            console.error("Error fetching cart from backend: ", error);
            setCartItems([]);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = useCallback(async (product) => {
        if (!isAuthenticated) {
            setCartItems((prev) => {
                const existing = prev.find((item) => item.id === product.id);
                if (existing) {
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
            fetchCart();
        } catch (error) {
            console.error("error adding to cart:", error);
        }
    }, [isAuthenticated, fetchCart]);

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

    const updateQuantity = useCallback(async (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            // return;
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

    const clearCart = useCallback(() => {
        setCartItems([]);
        localStorage.removeItem("guestCart");
    }, []);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}