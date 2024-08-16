 'use client';
import Bottom from "@/components/BottomNav";
import { Box, Button, Text, Accordion, Spinner, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Tabs, TabList, TabPanels, Tab, TabPanel, Tag } from "@chakra-ui/react";
import { IoChevronBackSharp } from "react-icons/io5";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from "next/image";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";
import { MdCall, MdRemoveRedEye } from "react-icons/md";

export default function Offers() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOffers();
    }
  }, [status]);

  const fetchOffers = async () => {
    try {
      const response = await fetch('/api/offers');
      if (response.ok) {
        const data = await response.json();
        setOffers(data);
      } else {
        console.error('Failed to fetch offers');
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!session) {
    router.push('/login');
  }

  const pendingOffers = offers.filter(offer => !offer.accepted);
  const acceptedOffers = offers.filter(offer => offer.accepted);

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
  
      <Bottom />
    </Box>
  );
}
