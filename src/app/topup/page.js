 'use client';
import Bottom from "@/components/BottomNav";
import { Box, Button, Text, Accordion, Spinner,SimpleGrid, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Tabs, TabList, TabPanels, Tab, TabPanel, Tag } from "@chakra-ui/react";
import { IoChevronBackSharp } from "react-icons/io5";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from "next/image";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";
import { MdCall, MdRemoveRedEye } from "react-icons/md";
import FWBTN from "../hooks/useFW";
import useUser from "@/app/hooks/useUser";

export default function Offers() {
  const { user, error } = useUser();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrice, setSelectedPrice] = useState(null);
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
        <Button color={'white'} bg={'none'} leftIcon={<IoChevronBackSharp />}>
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
  <SimpleGrid minChildWidth='120px' spacing='10px'>
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

<FWBTN amount={selectedPrice * 100} name={`${user?.firstName} ${user?.lastName}`} email={user?.email} phone_number={user?.phoneNumber}/>
  </Box>
      <Bottom />
    </Box>
  );
}
