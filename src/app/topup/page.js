'use client';
import Bottom from "@/components/BottomNav";
import { 
  Box, 
  Button, 
  Text, 
  SimpleGrid, 
  Input, 
  VStack, 
  HStack, 
  FormControl, 
  FormLabel, 
  FormErrorMessage,
  useToast
} from "@chakra-ui/react";
import { IoChevronBackSharp } from "react-icons/io5";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import FWBTN from "../hooks/useFW";
import Loading from "@/components/loading";
import useUser from "@/app/hooks/useUser";

export default function Offers() {
  const { user, error } = useUser();
  const router = useRouter();
  const toast = useToast();
  const { data: session, status } = useSession();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [customAmountError, setCustomAmountError] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      setLoading(false);
    }
  }, [status]);

  if (loading) {
    return <Loading />;
  }

  if (!session) {
    router.push('/login');
  }

  const prices = [
    { label: '100 TP', value: 100 },
    { label: '200 TP ', value: 200 },
    { label: '500 TP', value: 500 },
    { label: '1000 TP', value: 1000 },
  ];

  const handlePriceSelect = (price) => {
    setSelectedPrice(price.value);
    setCustomAmount(''); // Clear custom amount when preset is selected
    setCustomAmountError('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    
    // Validate custom amount
    if (value === '') {
      setCustomAmountError('');
      setSelectedPrice(null);
    } else {
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < 100) {
        setCustomAmountError('Amount must be at least 100');
        setSelectedPrice(null);
      } else {
        setCustomAmountError('');
        setSelectedPrice(numValue);
      }
    }
  };

  const renderPriceBoxes = () => {
    return (
      <SimpleGrid minChildWidth='120px' spacing='10px' mb={4}>
        {prices.map((price, index) => (
          <Box
            h={'100px'}
            key={index}
            borderWidth={2}
            borderColor={selectedPrice === price.value ? 'orange.500' : 'gray.200'}
            borderRadius="md"
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            cursor="pointer"
            onClick={() => handlePriceSelect(price)}
            _hover={{
              borderColor: 'orange.500',
            }}
          >
            <Text textAlign={'center'} fontWeight="bold">{price.label}</Text>
          </Box>
        ))}
      </SimpleGrid>
    );
  };

  const renderCustomAmountInput = () => {
    return (
      <VStack spacing={4} align="stretch" mb={4}>
        <FormControl isInvalid={!!customAmountError}>
          <FormLabel>Custom Amount (Minimum 100 TP)</FormLabel>
          <Input 
            placeholder="Enter custom amount" 
            value={customAmount}
            onChange={handleCustomAmountChange}
            type="number"
            min="100"
          />
          {customAmountError && (
            <FormErrorMessage>{customAmountError}</FormErrorMessage>
          )}
        </FormControl>
      </VStack>
    );
  };

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
        <Button 
          onClick={() => router.back()} 
          color={'white'} 
          bg={'none'} 
          leftIcon={<IoChevronBackSharp />}
        >
          Back
        </Button>
        <Text mr={'20px'} fontSize={'15px'} fontWeight={'600'}>
          Buy Points
        </Text>
      </Box>

      <Box 
        pt={'10px'}
        px={'10px'}
      >
        {renderPriceBoxes()}
        {renderCustomAmountInput()}

        {selectedPrice && (
          <FWBTN 
            amount={selectedPrice * 100} 
            name={`${user?.firstName} ${user?.lastName}`} 
            email={user?.email} 
            phone_number={user?.phoneNumber}
          />
        )}
      </Box>
      <Bottom />
    </Box>
  );
}