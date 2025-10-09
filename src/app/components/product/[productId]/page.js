'use client';
import React, { useState, useEffect } from 'react'; 
import Image from 'next/image'; 
import Navbar from '@/app/components/navbar/page';
import Footer from '@/app/components/footer/page';
import { usePathname } from 'next/navigation'; 

import { useDispatch } from 'react-redux';
import { add } from '@/Redux/Cartslice'; 
import { toast } from 'react-toastify';

const ProductsApi = 'https://api.keeva.in/api/products';  

export default function ProductDetails() {
  const router = usePathname();
  const id = router.split("/").pop();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayedImage, setDisplayedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch(); // Redux dispatch
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`${ProductsApi}/${id}`);
          if (response.ok) {
            const data = await response.json();
            setProduct(data);
            setDisplayedImage(data.images[0]); // Set the initial displayed image
          } else {
            console.error('Failed to fetch product');
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>; 

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleClickOutside = (event) => {
    if (event.target.className === 'modal') {
      closeModal();
    }
  };

  const handleAddToWishlist = (product) => {
    dispatch(add({ ...product, quantity: 1 }));
    toast('Added to Wishlist', {
      position: "bottom-center",
      autoClose: 1000, // 1 second
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      style: {
        backgroundColor: '#964B00',
        color: 'white',
        fontWeight: 'bold',
      },
    });
  };
  return (
    <div>
      <Navbar />
      <div style={{ marginTop: '100px' }}>
        <div className="product_detail_container">
          <div className="all_img_container">
            <Image
              className="main_product_img"
              src={displayedImage}
              alt={product.name}
              width={500}
              height={500}
              onClick={openModal}
              style={{ objectFit: 'cover' }} 
            />
            <div className="additional_images">
              {product.images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`${product.name} - ${index + 1}`}
                  width={80}
                  height={100}
                  onClick={() => setDisplayedImage(image)} // Change displayed image on click
                  className="thumbnail_image"
                  style={{ objectFit: 'cover' }} // Ensures image covers the entire area
                />
              ))}
            </div>
          </div>
          <div className="content_container">
            <h2 className="product_heading">{product.name}</h2>
            <p className="description">{product.description}</p>
            <p className="price">₹{product.price}</p>
            <button className="prodcut_button" onClick={() => handleAddToWishlist(product)}>Add To Wishlist</button>
          </div>
        </div>
      </div>
      <Footer />
      {isModalOpen && (
        <div className="modal" onClick={handleClickOutside}>
          <div className="modal_content">
            <span className="close_button" onClick={closeModal}>&times;</span>
            <Image
              src={displayedImage}
              alt={product.name}
              width={800}
              height={800}
              className="modal_image"
              style={{ objectFit: 'cover' }} // Ensures image covers the entire area
            />
          </div>
        </div>
      )}
      <style jsx>{`
        .product_detail_container {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          margin: 40px; 
        }
        .all_img_container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-right: 20px;
        }
        .main_product_img {
          width: 400px;
          height: 400px;
          cursor: pointer;
          object-fit: cover;
        }
        .additional_images {
          display: flex;
          flex-direction: row;
          gap: 10px;
          margin-top: 10px;
        }
        .thumbnail_image {
          cursor: pointer;
          width: 80px;
          height: 100px;
          object-fit: cover;
        }
        .content_container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          max-width: 400px;
        }
        .product_heading {
          font-size: 24px;
          margin: 10px 0;
        }
        .description {
          margin: 10px 0;
        }
        .price {
          font-size: 20px;
          color: green;
          margin: 10px 0;
        }
        @media (max-width: 768px) {
          .main_product_img {
            width: 90%;
            height: auto;
          }
          .additional_images {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
          }
          .content_container {
            width: 90%;
            margin-top: 20px;
          } 
        }
        .modal {
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.8);
          z-index: 1000;
        }
        .modal_content {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal_image {
          max-width: 80%;
          max-height: 80%;
          object-fit: cover;
        }
        .close_button {
          position: absolute;
          top: 14px;
          right: 10px;
          font-size: 60px; 
          cursor: pointer; 
          color: black;
          font-weight: bolder;
        }
      `}</style>
    </div>
  );
}
