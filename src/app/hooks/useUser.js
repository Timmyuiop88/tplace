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
  const response = await fetch('/api/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    throw new Error('Failed to send verification code');
  }
  return response.json();
};

const confirmVerificationCode = async ({ email, code }) => {
  const response = await fetch('/api/confirm-verification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });
  if (!response.ok) {
    throw new Error('Failed to verify code');
  }
  return response.json();
};

const useUser = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });

  const isEmailVerified = user?.emailVerified;

  const { mutate: sendVerificationCodeMutation, isLoading: isVerifying } = useMutation({
    mutationFn: sendVerificationCode,
    onSuccess: (data) => {
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

  const { mutate: confirmVerificationCodeMutation, isLoading: isConfirming } = useMutation({
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

  return { user, loading: isLoading, error, isEmailVerified, sendVerificationCodeMutation, isVerifying, confirmVerificationCodeMutation, isConfirming };
};

export default useUser;
