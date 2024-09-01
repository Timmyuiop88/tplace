'use client';
import Bottom from "@/components/BottomNav";
import {
  Box,
  Button,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  useToast,
  Skeleton,
  Tag,
} from "@chakra-ui/react";
import { IoChevronBackSharp } from "react-icons/io5";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

export default function TransactionHistory() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const toast = useToast();

  // Correct use of useQuery with object form
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
    <Box h={'100vh'} w={'100%'} maxW={'7xl'} m={'auto'} bg={'white'}>
      <Box
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
        <Text mr={'20px'} fontSize={'15px'} fontWeight={'600'}>
          Billing
        </Text>
      </Box>

      <TableContainer>
        <Table variant="simple">
          <TableCaption>Transaction History</TableCaption>
          <Thead>
            <Tr>
              <Th>Amount</Th>
              <Th>Payment Method</Th>
            
              <Th>Status</Th>
         
       
             
              <Th>Type</Th>
           
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions && transactions.map((transaction) => (
              <Tr key={transaction.id}>
                <Td>{transaction.currency} {transaction.amount}</Td>
                <Td>{transaction.paymentMethod}</Td>
             
                <Td>
                    <Tag
                    colorScheme={transaction.status === 'completed' ? 'teal' : 'red'}
                    >
                    {transaction.status}
                    </Tag>
                   </Td>
             
                <Td>{transaction.type}</Td>
              
            
                <Td>{new Date(transaction.createdAt).toLocaleDateString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      
      <Bottom />
    </Box>
  );
}
