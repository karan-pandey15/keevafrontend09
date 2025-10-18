"use client";

import axiosInstance from "@/app/helper/axiosInstance";
import { useState, useRef } from "react";
import Navbar from "../navbar/page";

const Toast = ({ message, type, onClose }) => {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  return (
    <div
      className={`fixed top-4 left-4 z-50 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in max-w-md`}
    >
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 hover:opacity-80">✖</button>
    </div>
  );
};

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    points: "",
    description: "",
    category: "",
  });
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  const categories = [
    "Ristal 0.8mm",
    "Ristal Door Skin",
    "Ristal 1mm",
    "Adalam",
    "Membrane Door",
    "Laminate Door",
    "Fevicol",
  ];

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (files.length > 5) {
      showToast("You can upload a maximum of 5 images!", "error");
      return;
    }

    setImages(files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.points || !formData.category) {
      showToast("Please fill in all required fields!", "error");
      return;
    }

    if (images.length === 0) {
      showToast("Please upload at least one image!", "error");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    images.forEach((file) => data.append("images", file));

    try {
      setUploading(true);

      const res = await axiosInstance.post("/sunmica", data);
      const uploaded = res.data?.data?.images || [];

      setUploadedUrls(uploaded); // ✅ store backend image URLs
      showToast("✅ Uploaded successfully!", "success");

      // reset form
      setFormData({ name: "", points: "", description: "", category: "" });
      setImages([]);
      setPreviewUrls([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      showToast("❌ Upload failed! Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="h-20"></div>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto bg-white p-8 rounded-3xl shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Upload Product
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
                required
              />

              <input
                type="number"
                name="points"
                placeholder="Points"
                value={formData.points}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
                required
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <textarea
                name="description"
                placeholder="Description (optional)"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl resize-none"
              />

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*;capture=camera"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl"
              />

              {/* Preview selected images */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {previewUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`preview-${idx}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              {/* Show uploaded images from backend */}
              {uploadedUrls.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">
                    Uploaded Images:
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {uploadedUrls.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`uploaded-${idx}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={uploading}
                className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all ${
                  uploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105"
                }`}
              >
                {uploading ? "Uploading..." : "Upload Product"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
