"use client";

import { useState, useRef } from "react";
import Navbar from "../navbar/page";
import axios from "axios";
import imageCompression from "browser-image-compression";

export default function AddSunmica() {
  const [formData, setFormData] = useState({
    name: "",
    points: "",
    description: "",
    category: "",
  });
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
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

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("You can upload maximum 5 images");
      return;
    }

    // Compress images for mobile
    const compressedFiles = [];
    for (const file of files) {
      const compressed = await imageCompression(file, {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });
      compressedFiles.push(compressed);
    }

    setImages(compressedFiles);
    setPreviewUrls(compressedFiles.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.points || !formData.category) {
      alert("Please fill all required fields");
      return;
    }

    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("points", formData.points);
    data.append("description", formData.description);
    data.append("category", formData.category);
    images.forEach((file) => data.append("images", file));

    try {
      setUploading(true);
      const res = await axios.post("/api/sunmica", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        alert("✅ Upload successful!");
        setFormData({ name: "", points: "", description: "", category: "" });
        setImages([]);
        setPreviewUrls([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        alert("❌ Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Something went wrong during upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg space-y-4"
        >
          <h2 className="text-2xl font-bold text-center text-indigo-600">
            Add Product
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="number"
            name="points"
            placeholder="Points"
            value={formData.points}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
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
            className="w-full border p-3 rounded-lg"
            rows={3}
          />

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*;capture=camera"
            onChange={handleFileChange}
            className="w-full border-dashed border-2 rounded-lg p-3 cursor-pointer"
          />

          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {previewUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`preview-${i}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className={`w-full py-3 rounded-xl text-white font-semibold ${
              uploading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {uploading ? "Uploading..." : "Upload Product"}
          </button>
        </form>
      </div>
    </>
  );
}
