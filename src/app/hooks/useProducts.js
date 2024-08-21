// hooks/useProducts.js
"use client"
import axios from 'axios';
import { useState, useEffect } from 'react';
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'
const fetchProducts = async () => {
  const { data } = await axios.get('/api/products');
  return data;
};
const fetchProductsById = async(id)=>{
  
  const { data } = await axios.get(`/api/products-by-ids?id=${id}`)
  return data
}

const useProducts = () => {
    const queryConfig = {
        refetchOnWindowFocus: true, // Refetch on window focus
        refetchInterval: 60000, // Refetch every 60 seconds (optional)
        refetchIntervalInBackground: true, // Continue refetching in background (optional)
      };
  const { data: products, isLoading, error } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from local storage on mount
  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(storedWishlist);
  }, []);

  // Save wishlist to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const handleWishlistToggle = (productId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.includes(productId)
        ? prevWishlist.filter((id) => id !== productId)
        : [...prevWishlist, productId]
    );
  };

  return { products, isLoading, error, };
};
export const useProductsID = (id) => {
  const queryConfig = {
    refetchOnWindowFocus: true,
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
  };

  const { data: products, isFetching, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => await fetchProductsById(parseInt(id)),
    ...queryConfig,
  });

  return { products, isFetching, error };
};

export default useProducts;
