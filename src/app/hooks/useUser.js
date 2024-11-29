import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

const fetchUser = async () => {
  const response = await fetch('/api/user');
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  return response.json();
};

const fetchKYCStatus = async () => {
  const response = await axios.get('/api/kyc/');
  if (response.status !== 200) {
    throw new Error(response.data.error || 'Failed to fetch KYC status');
  }
  return response.data.status; // Return "pending", "approved", or a custom message
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
  const response = await axios.post('/api/verify/confirm', { email, code });
  return response.data;
};

const useUser = (setIsVerifying) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: user, isLoading: isUserLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });

  const { data: kycStatus, isLoading: isKYCLoading, error: kycError } = useQuery({
    queryKey: ['kycStatus'],
    queryFn: fetchKYCStatus,
    enabled: !!user, // Only fetch KYC status if the user is logged in
  });

  const isEmailVerified = user?.emailVerified;

  const { mutateAsync: sendVerificationCodeMutation } = useMutation({
    mutationFn: sendVerificationCode,
    onSuccess: () => {
      setIsVerifying(false);
      toast({
        title: 'Verification Code Sent',
        description: `A code has been sent to ${user?.email}`,
        status: 'success',
        position: 'top-right',
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        position: 'top-right',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const { mutateAsync: confirmVerificationCodeMutation, isLoading: isConfirming } = useMutation({
    mutationFn: confirmVerificationCode,
    onSuccess: () => {
      toast({
        title: 'Email Verified',
        description: 'Your email has been verified successfully.',
        status: 'success',
        position: 'top-right',
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error) => {
      setIsVerifying(false);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        position: 'top-right',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  return {
    user,
    loading: isUserLoading ,
    error: error || kycError,
    isEmailVerified,
    sendVerificationCodeMutation,
    confirmVerificationCodeMutation,
    isConfirming,
    kycStatus, // Added KYC status
    isKYCLoading, // Added KYC loading state
  };
};

export default useUser;
