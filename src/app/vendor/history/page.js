'use client';

import Bottom from "@/components/BottomNav";
import {
  Box,
  Button,
  Text,
  Stack,
  Skeleton,
  Tag,
  useToast,
  useBreakpointValue,
} from "@chakra-ui/react";
import { IoChevronBackSharp } from "react-icons/io5";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { FaDollarSign, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';

export default function TransactionHistory() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const toast = useToast();

  // Fetch transaction data
  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data } = await axios.get('/api/transactions');
      return data;
    },
    enabled: !!session,  // Only fetch transactions if user is authenticated
  });

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <Box h={'100vh'} w={'100%'} maxW={'7xl'} m={'auto'} bg={'white'}>
        <Skeleton height="50px" />
        <Box p={4}>
          <Skeleton height="40px" mb={4} />
          <Skeleton height="200px" />
        </Box>
      </Box>
    );
  }

  // Handle error state
  if (error) {
    toast({
      title: 'Error',
      description: 'Failed to load transaction history.',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
    return null;
  }

  return (
    <Box h={'100vh'} w={'100%'}  m={'auto'} bg={'white'}>
      <Box
        mb={4}
        px={'10px'}
        w={'full'}
        h={'50px'}
        bg={'orange'}
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        color={'white'}
      >
        <Button color={'white'} bg={'none'} leftIcon={<IoChevronBackSharp />} onClick={() => router.back()}>
          Back
        </Button>
        <Text fontSize={'15px'} fontWeight={'600'}>
          Billing
        </Text>
      </Box>

      <Stack spacing={4} p={4}>
        {transactions && transactions.map((transaction) => (
          <Box
            key={transaction.id}
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
            bg="white"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Stack spacing={3}>
              <Text fontSize="xl" fontWeight="bold">
                {transaction.currency} {transaction.amount}
              </Text>
              <Text fontSize="md">
                <Tag
                  colorScheme={transaction.status === 'completed' ? 'teal' : 'red'}
                >
                  {transaction.status}
                </Tag>
              </Text>
              <Text fontSize="md">
                <Box as={FaCreditCard} mr={2} />
                {transaction.paymentMethod}
              </Text>
              <Text fontSize="md">
                <Box as={FaMoneyBillWave} mr={2} />
                {transaction.type}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {new Date(transaction.createdAt).toLocaleDateString()}
              </Text>
            </Stack>
          </Box>
        ))}
      </Stack>

      <Bottom />
    </Box>
  );
}
