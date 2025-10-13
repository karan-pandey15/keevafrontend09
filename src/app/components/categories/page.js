"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

import cat1 from "../../../../public/images/category1.png";
import cat2 from "../../../../public/images/doorskin.png";
import cat3 from "../../../../public/images/ristal1mm.png";
import cat4 from "../../../../public/images/adalon.png";
import cat6 from "../../../../public/images/laminatedoor.png";
import cat7 from "../../../../public/images/doorskin.png";

import Navbar from "../navbar/page";
import Footer from "../footer/page";

const categories = [
  { name: "Ristal 0.8mm", image: cat1 },
  { name: "Ristal Door Skin", image: cat2 },
  { name: "Ristal 1mm", image: cat3 },
  { name: "Adalam", image: cat4 },
  { name: "Membrane Door", image: cat7 },
  { name: "Laminate Door", image: cat6 },
  { name: "Fevicol", image: cat7 },
];

const Category = () => {
  return (
    <>
      <Navbar />
      <section className="min-h-screen   py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12 sm:mb-16 mt-8 sm:mt-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-3 bg-gradient-to-r from-[#047F05] to-emerald-600 bg-clip-text text-transparent">
              Explore Categories
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mb-4">
              Discover our premium collection of products
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#047F05] to-emerald-500 mx-auto rounded-full"></div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10  ">
            {categories.map((cat, index) => (
              <Link
                key={cat.name}
                href={`/ristalmica?category=${encodeURIComponent(cat.name)}`}
                className="group"
              >
                <div className="flex flex-col items-center transition-all duration-300 transform hover:-translate-y-2">
                  {/* Image Container with Gradient Border */}
                  <div className="relative">
                    {/* Gradient Border Effect */}
                    <div className="absolute  rounded-full blur opacity-25 group-hover:opacity-75  "></div>
                    
                    {/* Image */}
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-lg group-hover:shadow-2xl   bg-white">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#047F05]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm sm:text-base">
                          View Products →
                        </span>
                      </div>
                    </div>

                   
                  </div>

                  {/* Category Name */}
                  <h3 className="mt-4 text-sm sm:text-base lg:text-lg font-bold text-gray-800 text-center group-hover:text-[#047F05] transition-colors duration-300 px-2">
                    {cat.name}
                  </h3>

                  {/* Hover Indicator */}
                  <div className="mt-2 w-0 h-0.5 bg-gradient-to-r from-[#047F05] to-emerald-500 group-hover:w-16 transition-all duration-300 rounded-full"></div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom CTA Section */}
          <div className="mt-12 sm:mt-16 text-center">
            <div className="  p-8 sm:p-10 max-w-3xl mx-auto border border-gray-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Can't Find What You're Looking For?
              </h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Contact our team for personalized recommendations and assistance
              </p>
              <button className="bg-gradient-to-r from-[#047F05] to-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
               <Link href="/components/contact">Contact Us</Link>
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Category;