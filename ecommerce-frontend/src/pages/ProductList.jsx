import { useContext, useEffect, useMemo, useState } from "react";
import { fetchProducts } from "../services/productService";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";

export default function ProductList() {
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadProducts() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchProducts();
        if (!active) return;
        setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!active) return;
        setError("Backend not connected yet, showing no products.");
        setProducts([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.name, p.category].some((v) =>
        String(v || "").toLowerCase().includes(q)
      )
    );
  }, [products, query]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or category"
          className="w-full md:w-80 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="rounded-md bg-amber-100 text-amber-800 px-4 py-2 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-600">Loading products...</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-600">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <article key={p.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="h-40 rounded-md bg-gray-100 mb-4 flex items-center justify-center text-gray-400">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover rounded-md" />
                ) : (
                  <span>No image</span>
                )}
              </div>

              <div className="space-y-1">
                <h2 className="font-semibold text-lg text-gray-900">{p.name}</h2>
                <p className="text-sm text-gray-500">{p.category || "General"}</p>
                <p className="text-xl font-bold text-blue-700">Rs. {p.price}</p>
              </div>

              <button
                onClick={() => {
                  addToCart(p);
                  toast.success("Item added to cart successfully");
                }}
                disabled={!p.isAvailable}
                className="mt-4 w-full rounded-lg px-4 py-2 font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {p.isAvailable ? "Add to Cart" : "Out of Stock"}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}