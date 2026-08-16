import { createContext, useEffect, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token") || "");
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    useEffect(()=>{
        if(user){
            localStorage.setItem("user", JSON.stringify(user));
        }else {
            localStorage.removeItem("user");
        }
    },[user]);

    useEffect(()=>{
        if(!token) return;

        async function checkAuth(){
            try{
                const response = await api.get("/users/me");
                if(response.data.success){
                    setUser(response.data.data);
                }else{
                    logout();
                }
            }catch(error){
                console.error("Session verification failed:", error);
                logout();
            }
        }
        checkAuth();
    }, [token] );

    const mergeGuestCartToUserCart = async () => {
        try {
            const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

            if (!guestCart || guestCart.length === 0) {
                return;
            }

            for (const item of guestCart) {
                await api.post("/cart", {
                    productId: item.id,
                    quantity: item.quantity || 1
                });
            }

            localStorage.removeItem("guestCart");
        } catch (error) {
            console.error("Failed to merge guest cart:", error);
        }
    };

    const login = async (newToken, newUser) => {
        // 1. Store token in localStorage synchronously so subsequent API calls use it
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
        // 2. Merge guest cart items to the database
        try {
            await mergeGuestCartToUserCart();
        } catch (error) {
            console.error("Login cart merge failed:", error);
        }
        // 3. Update the state to trigger UI rendering
        setToken(newToken);
        setUser(newUser);
    };

    const register = async (newToken, newUser) => {
        // 1. Store token in localStorage synchronously so subsequent API calls use it
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
        // 2. Merge guest cart items to the database
        try {
            await mergeGuestCartToUserCart();
        } catch (error) {
            console.error("Register cart merge failed:", error);
        }
        // 3. Update the state to trigger UI rendering
        setToken(newToken);
        setUser(newUser);
    };
    const logout = ()=>{
        setToken("");
        setUser(null);
    };

    const value = {
        token,
        user,
        isAuthenticated: Boolean(token),
        login,
        register,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}