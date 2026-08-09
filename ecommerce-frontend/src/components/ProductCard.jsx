import React from "react";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <article className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition">
      <div className="h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="text-gray-400">No image</div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.category || "General"}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-700">Rs. {product.price}</span>
          <button
            onClick={() => onAddToCart && onAddToCart(product)}
            disabled={!product.isAvailable}
            className="ml-3 px-3 py-1 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
          >
            {product.isAvailable ? "Add" : "Out"}
          </button>
        </div>
      </div>
    </article>
  );
}