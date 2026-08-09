import { Link } from "react-router-dom";
import { ShoppingBag, Truck, Shield, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchFeaturedProducts } from "../services/productService";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [featuredError, setFeaturedError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadFeatureProducts() {
      setLoadingFeatured(true);
      setFeaturedError("");

      try {
        const data = await fetchFeaturedProducts();
        if (!active) return;

        setFeaturedProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!active) return;

        setFeaturedError("Could not load featured products.");
        setFeaturedProducts([]);
      } finally {
        if (active) setLoadingFeatured(false);
      }
    }

    loadFeatureProducts();

    return () => {
      active = false;
    };
  }, []);
  return (
    <div className="space-y-12">
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 rounded-lg">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to EcomHub</h1>
          <p className="text-xl mb-8">Shop the best products at unbeatable prices</p>
          <Link to="/products" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <FeatureCard
          icon={<ShoppingBag size={40} />}
          title="Wide Selection"
          description="Thousands of products to choose from"
        />
        <FeatureCard
          icon={<Truck size={40} />}
          title="Fast Shipping"
          description="Free shipping on orders over $50"
        />
        <FeatureCard
          icon={<Shield size={40} />}
          title="Secure Payment"
          description="100% secure checkout process"
        />
        <FeatureCard
          icon={<Star size={40} />}
          title="Best Prices"
          description="Lowest prices guaranteed"
        />
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-blue-600 font-medium hover:underline">
            View all products
          </Link>
        </div>

        {featuredError && (
          <div className="mb-4 rounded-md bg-amber-100 text-amber-800 px-4 py-2 text-sm">
            {featuredError}
          </div>
        )}

        {loadingFeatured ? (
          <p className="text-gray-500 text-center">Loading featured products...</p>
        ) : featuredProducts.length === 0 ? (
          <p className="text-gray-500 text-center">No featured products found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <article key={product.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="h-44 bg-gray-100 flex items-center justify-center">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category || "General"}</p>
                  <p className="text-xl font-bold text-blue-700">Rs. {product.price}</p>
                  {!product.isAvailable && (
                    <p className="text-sm text-red-600">Out of stock</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Reusable Feature Card Component
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
      <div className="text-blue-600 mb-4 flex justify-center">{icon}</div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}