"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity } from "../store/cartSlice";
import { useToast } from "../components/Toast";
import axiosInstance from "../helper/axiosInstance"; 

const BACKEND_URL = "https://api.digiente.com";

const RistalMica = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState({});

  // Fetch all products
  const fetchData = async () => {
    try {
      const res = await axiosInstance.get("/sunmica");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Check if product is in cart
  const getCartItem = (productId) => {
    return cartItems.find((item) => item.id === productId);
  };

  // Handle adding product to cart
  const handleAddToCart = async (product) => {
    const productId = product._id;
    setLoading((prev) => ({ ...prev, [productId]: true }));

    try {
      const cartItem = getCartItem(productId);

      if (cartItem) {
        // Product already in cart, increment quantity
        dispatch(
          updateQuantity({
            id: productId,
            quantity: cartItem.quantity + 1,
          })
        );
        toast.success(`Quantity updated to ${cartItem.quantity + 1}`);
      } else {
        // Add new product to cart
        dispatch(
          addToCart({
            id: product._id,
            name: product.name,
            description: product.description,
            image: `${BACKEND_URL}/${product.images?.[0].replace(/\\/g, "/")}`,
            points: product.points,
            quantity: 1,
            category: product.category,
          })
        );
        toast.success("🎉 Product added to cart!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to cart");
    } finally {
      setLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // Handle quantity increment
  const handleIncrement = (productId) => {
    const cartItem = getCartItem(productId);
    if (cartItem) {
      dispatch(
        updateQuantity({
          id: productId,
          quantity: cartItem.quantity + 1,
        })
      );
      toast.success(`Quantity increased to ${cartItem.quantity + 1}`);
    }
  };

  // Handle quantity decrement
  const handleDecrement = (productId) => {
    const cartItem = getCartItem(productId);
    if (cartItem && cartItem.quantity > 1) {
      dispatch(
        updateQuantity({
          id: productId,
          quantity: cartItem.quantity - 1,
        })
      );
      toast.success(`Quantity decreased to ${cartItem.quantity - 1}`);
    }
  };

  const handleImageClick = (productId) => {
    router.push(`/products/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Premium Sunmica Collection
          </h1>
          <p className="text-gray-600 text-lg">
            Discover quality products and earn rewards
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const productId = product._id;
            const cartItem = getCartItem(productId);
            const isInCart = !!cartItem;
            const isLoading = loading[productId];
            const imageUrl = `${BACKEND_URL}/${product.images?.[0].replace(
              /\\/g,
              "/"
            )}`;

            return (
              <div
                key={productId}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Product Image */}
                <div
                  className="relative h-64 bg-gray-100 overflow-hidden cursor-pointer"
                  onClick={() => handleImageClick(productId)}
                >
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                  {isInCart && (
                    <div className="absolute top-3 right-3 bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      In Cart
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                    {product.name}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                    {product.description}
                  </p>

                  {/* Points Badge */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="  text-[#006400] px-4 py-2 rounded-full text-sm font-bold">
                      🟡 {product.points} Points
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto">
                    {!isInCart ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center space-x-2">
                            <svg
                              className="animate-spin h-5 w-5"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            <span>Processing...</span>
                          </span>
                        ) : (
                          "Earn Points"
                        )}
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-teal-50 rounded-xl p-3 border-2 border-teal-200">
                          <span className="text-teal-800 font-semibold text-sm">
                            ✓ Added
                          </span>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDecrement(productId);
                              }}
                              className="w-8 h-8 flex items-center justify-center bg-white border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-600 hover:text-white transition-all duration-200 font-bold shadow-sm"
                            >
                              −
                            </button>
                            <span className="font-bold text-gray-900 min-w-[2rem] text-center text-lg">
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleIncrement(productId);
                              }}
                              className="w-8 h-8 flex items-center justify-center bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-200 font-bold shadow-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-center text-sm text-gray-600">
                          Total:{" "}
                          <span className="font-bold text-teal-600">
                            {product.points * cartItem.quantity} Points
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products available</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default RistalMica;