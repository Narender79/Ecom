import { createContext, useState, useCallback } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = useCallback((product) => {
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

    }, []);

    //remove item from cart entirely
    const removeFromCart = useCallback((productId) => {
        setCartItems((prev) => prev.filter((item) => item.id !== productId));
    }, []);

    //update quantity of item

    const updateQuantity = useCallback((productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            setCartItems((prev) =>
                prev.map((item) => item.id === productId ? { ...item, quantity } : item)
            );
        }
    }, [removeFromCart]);

    // clear entire cart
    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    //calculate total price
    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

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