"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectFavorites,
  toggleFavorite,
  addToCart,
  selectCartItems,
  hydrateCart,
} from "../../store/cartSlice";
import { useRouter } from "next/navigation";
import Navbar from "../navbar/page";
import Footer from "../footer/page";
import { Heart, ShoppingCart, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

export default function FavoritePage() {
  const favorites = useSelector(selectFavorites);
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const router = useRouter();

  // Hydrate cart from localStorage on mount
  useEffect(() => {
    dispatch(hydrateCart());
  }, [dispatch]);

  const handleAddToCart = (product) => {
    const cartItem = cartItems.find((item) => item.id === product.id);

    if (cartItem) {
      toast.success(`${product.name} quantity increased!`);
    } else {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          description: product.description,
          image: product.image,
          points: product.points,
          quantity: 1,
          category: product.category,
        })
      );
      toast.success(`${product.name} added to cart!`);
    }
  };

  const handleRemoveFromFavorites = (product) => {
    dispatch(
      toggleFavorite({
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.image,
        points: product.points,
        category: product.category,
      })
    );
    toast.success(`${product.name} removed from favorites`);
  };

  const handleViewProduct = (productId) => {
    router.push(`/products/${productId}`);
  };

  return (
    <>
      <Toaster position="top-right" />
      <Navbar />

      <div className="min-h-screen bg-white pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              My Favorites ❤️
            </h1>
            <p className="text-gray-600">
              {favorites.length === 0
                ? "You haven't added any favorites yet"
                : `You have ${favorites.length} favorite product${
                    favorites.length !== 1 ? "s" : ""
                  }`}
            </p>
          </div>

          {/* Favorites Grid */}
          {favorites.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <div className="inline-block p-6 bg-gray-50 rounded-2xl mb-4">
                <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  No favorites yet
                </h2>
                <p className="text-gray-600 mb-6 max-w-sm">
                  Start adding products to your favorites by clicking the heart
                  icon on any product!
                </p>
                <button
                  onClick={() => router.push("/allproductdisplay")}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Browse Products
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((product) => {
                const isInCart = cartItems.some((item) => item.id === product.id);

                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col"
                  >
                    {/* Image Container */}
                    <div
                      className="relative h-56 sm:h-64 bg-gray-100 overflow-hidden cursor-pointer"
                      onClick={() => handleViewProduct(product.id)}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized
                      />

                      {/* Remove from Favorites Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromFavorites(product);
                        }}
                        className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:bg-red-50 z-10"
                        title="Remove from favorites"
                      >
                        <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                      </button>

                      {/* In Cart Badge */}
                      {isInCart && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center gap-1">
                          <ShoppingCart className="w-3 h-3" /> In Cart
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="p-4 flex flex-col flex-grow">
                      {/* Product Name */}
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-gray-700 transition-colors">
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Category Badge */}
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                          {product.category}
                        </span>
                      </div>

                      {/* Points */}
                      <div className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex-grow">
                        ₹{product.points}
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                          isInCart
                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            : "bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-lg"
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>
                          {isInCart ? "Already in Cart" : "Add to Cart"}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}