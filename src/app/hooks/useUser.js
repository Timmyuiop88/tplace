// hooks/useUser.js

import axios from 'axios';
import { useState, useEffect } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

const fetchUser = async () => {
  const response = await fetch('/api/user');
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  return response.json();
};

const sendVerificationCode = async (email) => {
  try {
    console.log({ email });
    
    const response = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }), // Ensure body is a JSON string
    });

    if (!response.ok) {
      console.log({ response });
      throw new Error('Failed to send verification code');
    }

    return await response.json(); // Await the parsed response
  } catch (error) {
    console.error('Error:', error.message);
    throw error; // Rethrow the error for further handling if needed
  }
};


const confirmVerificationCode = async ({ email, code }) => {
  try {
    const response = await axios.post('/api/verify/confirm', {
      email,
      code,
    });

    return response.data;  // Return the parsed data
  } catch (error) {
     throw new Error(error.response.data.error|| 'Failed to confirm verification code');
  }
};

const useUser = (setIsVerifying) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });

  const isEmailVerified = user?.emailVerified;

  const { mutateAsync: sendVerificationCodeMutation } = useMutation({
    mutationFn: sendVerificationCode,
    onSuccess: (data) => {
      setIsVerifying(false)
      toast({
        title: "Verification Code Sent",
        description: `A code has been sent to ${user?.email}`,
        status: "success",
        position: 'top-right',
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        position: 'top-right',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const { mutateAsync: confirmVerificationCodeMutation,isPending: isConfirming } = useMutation({
    mutationFn: confirmVerificationCode,
    onSuccess: (data) => {
      toast({
        title: "Email Verified",
        description: "Your email has been verified successfully.",
        status: "success",
        position: 'top-right',
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error) => {
      setIsVerifying(false)
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        position: 'top-right',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  return { user, loading: isLoading, error, isEmailVerified, sendVerificationCodeMutation, confirmVerificationCodeMutation, isConfirming, isLoading };
};

export default useUser;
