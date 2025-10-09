"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { ImCross } from "react-icons/im";
import { UserCircle, ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";
import { selectDistinctCount, selectTotalQuantity } from "../../store/cartSlice";

const Navbar = () => {
  const [userRole, setUserRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPagesSubMenuOpen, setIsPagesSubMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const distinctCount = useSelector(selectDistinctCount);
  const totalQuantity = useSelector(selectTotalQuantity);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserRole(parsedUser.role);
    } else {
      setUserRole("user");
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const toggleMenu = () => setIsMenuOpen((s) => !s);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setUserRole("user");
    router.push("/components/signin");
  };

  const menuItems = userRole === "admin" ? [
    { name: "Home", href: "/" },
    { name: "Add Products", href: "/components/addproduct" },
    { name: "All Products", href: "/adminviewproducts" },
    { name: "All Users", href: "/components/allusers" },
  ] : [
    { name: "Home", href: "/" },
    { name: "About", href: "/" },
    { name: "Shop", href: "#" },
    { name: "Blog", href: "/" },
  ];

  return (
    <>
      <header className="flex justify-center w-full navbar_sticky topnav_fixed bg-white">
        <nav className="flex justify-between items-center w-[95%] py-4">
          <div>
            <Link href="/" className="font-bold text-2xl text-[#047F05]">
              KEEVA
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <ul className="flex items-center">
              {menuItems.map((item) => (
                <li key={item.name} className={item.name === "Shop" ? "relative" : ""}>
                  <Link
                    href={item.href}
                    className="flex items-center mx-2 lg:mx-5 uppercase text-[14px] lg:text-base tracking-[.15em] font-medium"
                  >
                    {item.name}
                    {item.name === "Shop" && <MdKeyboardArrowDown className="text-lg mt-[2px]" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <ul className="flex items-center text-[#047F05] space-x-4">
            <div className="px-3">
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/components/profile")}>
                    <UserCircle className="w-6 h-6" />
                    <span className="hidden md:block">{user.username}</span>
                  </div>
                  <button title="Logout" onClick={handleLogout} className="ml-2 text-xl">
                    <IoIosLogOut />
                  </button>
                </div>
              ) : (
                <span className="text-sm">
                  Hello, <Link href="/components/signin" className="underline">sign in</Link>
                </span>
              )}
            </div>

            {userRole !== "admin" && (
              <li className="cursor-pointer" onClick={() => router.push("/cart")}>
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 text-[#047F05]" />
                  {distinctCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {distinctCount}
                    </span>
                  )}
                </div>
              </li>
            )}

            <li className="md:hidden mx-1">
              <button onClick={toggleMenu}>
                <GiHamburgerMenu className="font-bold text-xl" />
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          onClick={toggleMenu}
        >
          <div className="bg-white w-3/4 h-full absolute right-0 p-4 flex flex-col">
            <button className="self-end mb-4" onClick={toggleMenu}>
              <ImCross className="w-6 h-6 text-gray-600" />
            </button>
            <ul className="flex-1 space-y-4">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="block py-2 text-base font-medium text-gray-700 hover:text-[#047F05]"
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              {user ? (
                <>
                  <li className="border-t pt-4">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
                      router.push("/components/profile");
                      toggleMenu();
                    }}>
                      <UserCircle className="w-5 h-5 text-gray-600" />
                      <span>{user.username}</span>
                    </div>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full py-2 text-left text-base font-medium text-gray-700 hover:text-red-600"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/components/signin"
                    className="block py-2 text-base font-medium text-gray-700 hover:text-[#047F05]"
                    onClick={toggleMenu}
                  >
                    Sign In
                  </Link>
                </li>
              )}
              {userRole !== "admin" && (
                <li>
                  <Link
                    href="/cart"
                    className="block py-2 flex items-center gap-2 text-base font-medium text-gray-700 hover:text-[#047F05]"
                    onClick={toggleMenu}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Cart ({distinctCount})
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;