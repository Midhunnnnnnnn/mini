import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://fakestoreapiserver.reactbd.com/products");
        setProducts(response.data);
        const uniqueCategories = [...new Set(response.data.map(product => product.category))];
        setCategories(['all', ...uniqueCategories]);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="max-w-screen-xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Shop</h1>
      <div className="mb-8">
        <label htmlFor="category" className="mr-4">Filter by Category:</label>
        <select 
          id="category" 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <img src={product.image} alt={product.title} className="w-full h-64 object-cover" />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
              <p className="text-gray-600 mb-4">${product.price}</p>
              <p className="text-sm text-gray-500 capitalize">Category: {product.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;