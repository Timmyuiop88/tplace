"use client";
import axios from 'axios';
import { useState, useEffect } from 'react';
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

const fetchProducts = async () => {
    const { data } = await axios.get('/api/products');
    return data;
};

const fetchProductsById = async (id) => {
    const { data } = await axios.get(`/api/products-by-ids?id=${id}`);
    return data;
};

const fetchProductsByName = async (name) => {
    const { data } = await axios.get(`/api/products-by-name?name=${name}`);
    return data;
};

export const useProducts = () => {
    const { data: products, isLoading, error, refetch } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
        refetchOnWindowFocus: true,
        refetchInterval: 60000,
        refetchIntervalInBackground: true,
    });

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

    return { products, isLoading, error, handleWishlistToggle, wishlist,refetch };
};

export const useProductsID = (id) => {
    const { data: products, isFetching, error, refetch: refetchID } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => await fetchProductsById(parseInt(id)),
        refetchOnWindowFocus: true,
        refetchInterval: 60000,
        refetchIntervalInBackground: true,
    });

    return { products, isFetching, error, refetchID };
};

export const useProductName = (name) => {
    const { data: products, isLoading, error } = useQuery({
        queryKey: ['productsByName', name],
        queryFn: async () => await fetchProductsByName(name),
        enabled: !!name,  // Only run query if name is not empty
        refetchOnWindowFocus: true,
    });

    return { products, isLoading, error };
};


const fetchOwnerProducts = async () => {
  const { data } = await axios.get('/api/owner-products');
  return data;
};

export const useProductOwner = () => {
  const { data: session, status } = useSession();

  const { data: ownerProducts, isLoading, error, refetch: refetchOwn  } = useQuery({
    queryKey: ['ownerProducts'],
    queryFn: fetchOwnerProducts,
    enabled: status === 'authenticated',  // Run the query only if the user is authenticated
    refetchOnWindowFocus: true,
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
  });

  return { ownerProducts, isLoading, error, refetchOwn };
};
export default useProducts;
