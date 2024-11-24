import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { cartImg, logoDark, userAvatar } from "../assets/index";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const productData = useSelector((state) => state.bazar.productData);
  const userInfo = useSelector((state) => state.bazar.userInfo);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapiserver.reactbd.com/products");
        const data = await response.json();
        setAllProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 0) {
      const filteredProducts = allProducts.filter(product =>
        product.title.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(filteredProducts);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchResultClick = (product) => {
    navigate(`/product/${product.id}`, { state: { item: product } });
    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <div className="w-full h-20 bg-white font-serif font-light border-b-[1px] border-b-gray-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-screen-xl h-full mx-auto flex items-center justify-between">
        <Link to="/">
          <div className="animate-pulse">
            <img className="w-28" src={logoDark} alt="logoDark" />
          </div>
        </Link>
        <div className="w-full max-w-xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-2 border-2 border-gray-400 rounded-md focus:outline-none focus:border-blue-500 transition-all duration-300 font-serif font-light"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                {searchResults.map(product => (
                  <div
                    key={product.id}
                    onClick={() => handleSearchResultClick(product)}
                    className="block p-2 hover:bg-gray-100 cursor-pointer font-serif font-light"
                  >
                    {product.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-base text-black font-serif font-light hover:text-orange-900 hover:underline underline-offset-2 decoration-[1px] cursor-pointer"
          >
            HOME
          </Link>
          <Link
            to="/new-arrivals"
            className="text-base text-black font-serif font-light hover:text-orange-900 hover:underline underline-offset-2 decoration-[1px] cursor-pointer"
          >
            NEW ARRIVALS
          </Link>
          <Link
            to="/the-classic"
            className="text-base text-black font-serif font-light hover:text-orange-900 hover:underline underline-offset-2 decoration-[1px] cursor-pointer"
          >
            THE CLASSIC
          </Link>
          <Link
            to="/blog"
            className="text-base text-black font-serif font-light hover:text-orange-900 hover:underline underline-offset-2 decoration-[1px] cursor-pointer"
          >
            OUR STORY
          </Link>
          <Link
            to="/community"
            className="text-base text-black font-serif font-light hover:text-orange-900 hover:underline underline-offset-2 decoration-[1px] cursor-pointer"
          >
            COMMUNITY
          </Link>
          <Link
            to="/cart"
            className="text-base text-black font-serif font-light hover:text-orange-900 hover:underline underline-offset-2 decoration-[1px] cursor-pointer"
          >
            <div className="relative">
              <img className="w-6" src={cartImg} alt="cartImg" />
              <span className="absolute w-6 top-2 left-0 text-sm flex items-center justify-center font-semibold font-titleFont">
                {productData ? productData.length : 0}
              </span>
            </div>
          </Link>
          <Link to="/login">
            <img
              className="w-8 h-8 rounded-full"
              src={
                userInfo && userInfo.image
                  ? userInfo.image
                  : userAvatar
              }
              alt="userLogo"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
