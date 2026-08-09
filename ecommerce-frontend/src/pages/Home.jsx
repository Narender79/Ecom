import { Link } from "react-router-dom";
import HeroCarousel from "../components/HeroCarousel";
import ProductCard from "../components/ProductCard";
import { useEffect, useState, useContext } from "react";
import { fetchFeaturedProducts } from "../services/productService";
import { CartContext } from "../context/CartContext";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await fetchFeaturedProducts();
        if (!active) return;
        setFeatured(Array.isArray(data) ? data : []);
      } catch {
        if (!active) return;
        setFeatured([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const categories = [
    { title: "Electronics", href: "/products?cat=Electronics" },
    { title: "Fashion", href: "/products?cat=Fashion" },
    { title: "Furniture", href: "/products?cat=Furniture" },
    { title: "Accessories", href: "/products" }
  ];

  return (
    <div className="space-y-12">
      <HeroCarousel />

      <section className="max-w-6xl mx-auto px-4">
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
          {categories.map((c) => (
            <Link key={c.title} to={c.href} className="block bg-white rounded-lg p-6 shadow hover:shadow-lg transition text-center">
              <h3 className="font-semibold text-lg">{c.title}</h3>
              <p className="mt-2 text-sm text-gray-500">Explore {c.title}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-blue-600 font-medium">View all</Link>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading featured...</p>
        ) : featured.length === 0 ? (
          <p className="text-gray-500">No featured products yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
            ))}
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">Free Shipping over Rs. 2000</h3>
            <p className="mt-1 text-sm text-white/90">Fast delivery and easy returns</p>
          </div>
          <Link to="/products" className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold">Shop Offers</Link>
        </div>
      </section>
    </div>
  );
}