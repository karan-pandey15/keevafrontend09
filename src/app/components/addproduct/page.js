"use client";

import axiosInstance from "@/app/helper/axiosInstance";
import { useState, useRef } from "react";
import Navbar from "../navbar/page";

export default function AddSunmica() {
  const [formData, setFormData] = useState({
    name: "",
    points: "",
    description: "",
    category: "",
  });
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (files.length > 5) {
      alert("You can upload a maximum of 5 images");
      return;
    }

    setImages(files);
    setPreviewUrls(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Please select at least one image");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("points", formData.points);
    data.append("description", formData.description);
    data.append("category", formData.category);

    // ✅ append each file individually — no arrays
    images.forEach((file) => data.append("images", file));

    try {
      setLoading(true);
      const res = await axiosInstance.post("/sunmica", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Upload response:", res.data);
      alert("Upload successful!");

      // reset form
      setFormData({ name: "", points: "", description: "", category: "" });
      setImages([]);
      setPreviewUrls([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Upload failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-xl space-y-4"
        >
          <h2 className="text-2xl font-bold text-center text-indigo-600">
            Add Sunmica Product
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="number"
            name="points"
            placeholder="Points"
            value={formData.points}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
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
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            rows="3"
          />

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*;capture=camera"
            onChange={handleFileChange}
            className="w-full border-dashed border-2 p-3 rounded-lg cursor-pointer"
          />

          {/* Preview selected images */}
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {previewUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`preview-${i}`}
                  className="w-full h-32 object-cover rounded-xl"
                />
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </>
  );
}
