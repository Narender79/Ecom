import React from "react";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <article className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="h-44 bg-gray-100 flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="text-gray-400">No image</span>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.category || "General"}</p>
        <p className="text-xl font-bold text-blue-700">Rs. {product.price}</p>

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onAddToCart && onAddToCart(product)}
            disabled={!product.isAvailable}
            className="flex-1 rounded-lg px-4 py-2 font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
          >
            {product.isAvailable ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </article>
  );
}