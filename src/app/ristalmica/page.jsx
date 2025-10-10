"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity } from "../store/cartSlice";
import { useToast } from "../components/Toast";
import axiosInstance from "../helper/axiosInstance";
import Navbar from "../components/navbar/page";

const BACKEND_URL = "https://api.digiente.com";

const RistalMica = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const toast = useToast();
  const cartItems = useSelector((state) => state.cart.items);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch products from backend
  const fetchData = async (category) => {
    try {
      const res = await axiosInstance.get("/sunmica");
      const allProducts = res.data;
      // Filter products by category if provided
      const filtered = category
        ? allProducts.filter(
            (item) => item.category?.toLowerCase() === category.toLowerCase()
          )
        : allProducts;

      setProducts(filtered);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    const categoryFromURL = searchParams.get("category");
    setSelectedCategory(categoryFromURL || "");
    fetchData(categoryFromURL);
  }, [searchParams]);

  // Find item in cart
  const getCartItem = (productId) =>
    cartItems.find((item) => item.id === productId);

  // Add to cart
  const handleAddToCart = async (product) => {
    const productId = product._id;
    setLoading((prev) => ({ ...prev, [productId]: true }));
    try {
      const cartItem = getCartItem(productId);
      if (cartItem) {
        dispatch(
          updateQuantity({
            id: productId,
            quantity: cartItem.quantity + 1,
          })
        );
        toast.success(`Quantity updated to ${cartItem.quantity + 1}`);
      } else {
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
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    } finally {
      setLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

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
  <div>
    <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {selectedCategory
              ? `${selectedCategory} Collection`
              : "Discover quality products and earn rewards"}
          </h1>
   
        </div>

        {/* Product Grid */}
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
                {/* Image */}
                <div
                  className="relative h-64 bg-gray-100 overflow-hidden cursor-pointer"
                  onClick={() => handleImageClick(productId)}
                >
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                  {isInCart && (
                    <div className="absolute top-3 right-3 bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      In Cart
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                    {product.description}
                  </p>

                  <div className="text-[#006400] px-4 py-2 rounded-full text-sm font-bold mb-4">
                    🟡 {product.points} Points
                  </div>

                  {/* Add / Update Buttons */}
                  <div className="mt-auto">
                    {!isInCart ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-50"
                      >
                        {isLoading ? "Processing..." : "Earn Points"}
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
                              className="w-8 h-8 flex items-center justify-center bg-white border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-600 hover:text-white transition-all duration-200"
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
                              className="w-8 h-8 flex items-center justify-center bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-200"
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
            <p className="text-gray-500 text-lg">
              No products found for{" "}
              <span className="font-semibold">{selectedCategory}</span>
            </p>
          </div>
        )}
      </main>
    </div>
  </div>
  );
};

export default RistalMica;
