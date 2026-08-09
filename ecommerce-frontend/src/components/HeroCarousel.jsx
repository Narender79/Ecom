import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    title: "Discover Top Deals",
    subtitle: "Featured, best-selling products handpicked for you",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80&auto=format&fit=crop",
    cta: "/products"
  },
  {
    title: "Comfort & Style",
    subtitle: "Furniture and lifestyle essentials",
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1600&q=80&auto=format&fit=crop",
    cta: "/products"
  },
  {
    title: "Upgrade Your Audio",
    subtitle: "Shop headphones & accessories",
    image: "https://images.unsplash.com/photo-1518444020046-0f0b1d3a4f6b?w=1600&q=80&auto=format&fit=crop",
    cta: "/products"
  }
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, []);
  const slide = slides[index];

  return (
    <section className="relative rounded-lg overflow-hidden">
      <div
        className="h-72 sm:h-96 bg-center bg-cover flex items-center"
        style={{ backgroundImage: `url(${slide.image})` }}
        aria-hidden
      >
        <div className="bg-black/40 w-full">
          <div className="max-w-6xl mx-auto px-6 py-12 text-white">
            <h1 className="text-3xl sm:text-5xl font-bold">{slide.title}</h1>
            <p className="mt-2 text-sm sm:text-lg text-white/90">{slide.subtitle}</p>
            <div className="mt-6">
              <Link to={slide.cta} className="inline-block bg-white text-black px-5 py-2 rounded-md font-medium">
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-3 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}