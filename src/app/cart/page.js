"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectTotalPoints,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../store/cartSlice";
import axiosInstance from "@/app/helper/axiosInstance";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar/page";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Award,
  ArrowLeft,
  CheckCircle,
  X,
  AlertCircle,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Footer from "../components/footer/page";

export default function CartPage() {
  const items = useSelector(selectCartItems);
  const totalPoints = useSelector(selectTotalPoints);
  const dispatch = useDispatch();
  const router = useRouter();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQtyChange = (id, qty) => {
    dispatch(updateQuantity({ id, quantity: Math.max(1, qty) }));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    toast.success("Item removed from cart");
  };

  const handleCheckoutClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in before checkout");
      router.push("/components/signin");
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleConfirmCheckout = async () => {
    const token = localStorage.getItem("token");
    setIsProcessing(true);

    try {
      const payload = {
        items: items.map((it) => ({
          userId: it.id,
          productName: it.name,
          quantity: it.quantity,
          points: it.points,
          description: it.description,
        })),
      };

      const res = await axiosInstance.post("/points/request", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res?.status === 200 || res?.status === 201) {
        toast.success("Checkout successful!");
        dispatch(clearCart());
        setShowCheckoutModal(false);
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        toast.error("Checkout response: " + res.status);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Checkout failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelCheckout = () => {
    setShowCheckoutModal(false);
  };

  return (
    <>
      <Toaster position="top-right" />
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-[#047F05] transition-colors group mb-4"
            >
              <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Continue Shopping</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="bg-[#047F05] p-3 rounded-xl shadow-lg">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Shopping Cart
                </h1>
                <p className="text-gray-600 mt-1">
                  {items.length} {items.length === 1 ? "item" : "items"} in your cart
                </p>
              </div>
            </div>
          </div>

          {items.length === 0 ? (
            /* Empty Cart State */
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  Your cart is empty
                </h2>
                <p className="text-gray-600 mb-8">
                  Looks like you haven't added any items to your cart yet.
                  Start shopping to earn points!
                </p>
                <button
                  onClick={() => router.push("/")}
                  className="inline-flex items-center space-x-2 bg-[#047F05] hover:bg-[#036804] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Go to Shop</span>
                </button>
              </div>
            </div>
          ) : (
            /* Cart Items */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items List */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((it) => (
                  <div
                    key={it.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-4 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-gray-100">
                          <img
                            src={it.image}
                            alt={it.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                              {it.name}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {it.description}
                            </p>
                            <div className="flex items-center space-x-2 text-[#047F05]">
                              <Award className="w-4 h-4" />
                              <span className="font-semibold">
                                {it.points} points each
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() =>
                                handleQtyChange(it.id, (it.quantity || 1) - 1)
                              }
                              className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                              disabled={it.quantity <= 1}
                            >
                              <Minus className="w-4 h-4 text-gray-700" />
                            </button>
                            <input
                              type="number"
                              value={it.quantity}
                              onChange={(e) =>
                                handleQtyChange(
                                  it.id,
                                  parseInt(e.target.value || "1")
                                )
                              }
                              className="w-16 h-10 text-center border-2 border-gray-200 rounded-lg font-semibold focus:border-[#047F05] focus:outline-none"
                              min="1"
                            />
                            <button
                              onClick={() =>
                                handleQtyChange(it.id, (it.quantity || 1) + 1)
                              }
                              className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-4 h-4 text-gray-700" />
                            </button>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-sm text-gray-600">Subtotal</div>
                              <div className="text-xl font-bold text-[#047F05]">
                                {it.points * it.quantity} pts
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemove(it.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Items</span>
                      <span className="font-semibold">{items.length}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Total Quantity</span>
                      <span className="font-semibold">
                        {items.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center space-x-2">
                        <Award className="w-5 h-5 text-[#047F05]" />
                        <span className="font-semibold text-gray-900">
                          Total Points
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-[#047F05]">
                        {totalPoints}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckoutClick}
                    className="w-full bg-[#047F05] hover:bg-[#036804] text-white px-6 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Proceed to Checkout</span>
                  </button>

                  <button
                    onClick={() => router.push("/")}
                    className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Continue Shopping</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Confirmation Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 transform transition-all">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-yellow-100 p-3 rounded-full">
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
              Confirm Checkout
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to proceed with checkout for{" "}
              <span className="font-bold text-[#047F05]">{totalPoints} points</span>?
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Total Items:</span>
                <span className="font-semibold">{items.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Points:</span>
                <span className="font-bold text-[#047F05] text-xl">
                  {totalPoints}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCancelCheckout}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleConfirmCheckout}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-[#047F05] hover:bg-[#036804] text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Confirm</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
