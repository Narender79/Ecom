import { Link } from "react-router-dom";
import { ShoppingBag, Truck, Shield, Star } from "lucide-react";

export default function Home(){
    return (
    <div className="space-y-12">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 rounded-lg">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to EcomHub</h1>
          <p className="text-xl mb-8">Shop the best products at unbeatable prices</p>
          <Link to="/products" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
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

      {/* Featured Products Section (Placeholder) */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <p className="col-span-full text-gray-500 text-center">
            Loading products... (Will connect to backend API next)
          </p>
        </div>
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