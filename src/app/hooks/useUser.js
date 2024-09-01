// hooks/useUser.js

import axios from 'axios';
import { useState, useEffect } from 'react';
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'

const fetchUser = async () => {
  const response = await fetch('/api/user');
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  return response.json();
};

const useUser = () => {
    const queryClient = useQueryClient()
  const queryConfig = {
    refetchOnWindowFocus: true, // Refetch on window focus
    refetchInterval: 60000, // Refetch every 60 seconds (optional)
    refetchIntervalInBackground: true, // Continue refetching in background (optional)
  };
  const { data: user, isLoading, error } = useQuery({ queryKey: ['user'], queryFn: fetchUser });

const isEmailVerified = user?.emailVerified
  return { user, loading: isLoading, error, isEmailVerified };
};

export default useUser;
