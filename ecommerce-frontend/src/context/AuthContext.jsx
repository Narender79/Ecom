import { createContext, useEffect, useState } from "react";

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
            localStorage.setItem("user",JSON.stringify(user));
        }else {
            localStorage.removeItem("user");
        }
    },[user]);

    const login = (newToken, newUser) => {
        setToken(newToken);
        setUser(newUser);
    }
    const register = (newToken, newUser)=>{
        setToken(newToken);
        setUser(newUser);
    }
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
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}