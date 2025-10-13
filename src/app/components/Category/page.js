 


 

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

import "./Categofystyle.css";

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
    <section style={{ backgroundColor: "#fff" }}>
      <h1 className="four_heading_div">Watch Our Collection</h1>
      <div className="four_div_container">
        {categories.map((cat) => (
          <div key={cat.name} className="round_container">
            <Link href={`/ristalmica?category=${encodeURIComponent(cat.name)}`}>
              <Image
                src={cat.image}
                className="round_contaner_img"
                alt={cat.name}
              />
              <p className="txt_container">{cat.name}</p>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Category;
