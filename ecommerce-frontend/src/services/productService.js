import api from "./api";

export async function fetchProducts() {
    const res = await api.get("/products");
    return res.data.data;
}

export async function fetchFeaturedProducts(){
    const res = await api.get("/products/featured");
    return res.data.data;
}