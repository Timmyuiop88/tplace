'use client';
import Bottom from "@/components/BottomNav";
import { Box, Button, Text, Skeleton, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Tabs, TabList, TabPanels, Tab, TabPanel, Tag, useToast } from "@chakra-ui/react";
import { IoChevronBackSharp } from "react-icons/io5";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdCall, MdRemoveRedEye } from "react-icons/md";
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';


export default function Offers() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const toast = useToast();
    const queryClient = useQueryClient();
  
    const fetchOffers = async () => {
      const response = await fetch('/api/ownerOffers');
      if (!response.ok) {
        throw new Error('Failed to fetch offers');
      }
      return response.json();
    };
  
    const { data: offers = [], isLoading } = useQuery({
      queryKey: ['offers'],
      queryFn: fetchOffers,
      enabled: status === 'authenticated',
    });
  
    const mutation = useMutation({
      mutationFn: async ({ offerId, action }) => {
        const response = await fetch(`/api/${action}Offer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ offerId }),
        });
  
        if (!response.ok) {
          throw new Error(`Failed to ${action} offer`);
        }
  
        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['offers'] });
        toast({
          title: 'Success',
          description: 'Offer has been updated successfully.',
          status: 'success',
          duration: 5000,
          position:'top',
          isClosable: true,
        });
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 5000,
          position:'top',
          isClosable: true,
        });
      }
    });
  
    // if (!session) {
    //   router.push('/login');
    //   return null;
    // }
  
    const handleAccept = (offerId) => {
      mutation.mutate({ offerId, action: 'accept' });
    };
  
    const handleReject = (offerId) => {
      mutation.mutate({ offerId, action: 'reject' });
    };
  

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
          Offers
        </Text>
      </Box>
      <Tabs py={'10px'} variant='soft-rounded' colorScheme='orange' w={'full'} pb={'80px'}>
        <TabList justifyContent={'center'}>
          <Tab>Pending Offers</Tab>
          <Tab>Accepted Offers</Tab>
        </TabList>

        {isLoading ? (
          <Box py={'10px'} w={'full'} px={'10px'}>
            <Skeleton borderRadius={'10px'} pt={'20px'} mb={'10px'} height="70px" />
            <Skeleton borderRadius={'10px'} height="70px" />
          </Box>
        ) : (
          <TabPanels>
            <TabPanel>
              <Accordion allowToggle allowMultiple={false}>
                {pendingOffers.length > 0 ? (
                  pendingOffers.map((offer) => (
                    <AccordionItem key={offer.id}>
                      <h2>
                        <AccordionButton h={'auto'}>
                          <Box flex="1" textAlign="left" display={'flex'} alignItems={'center'} justifyContent={''} pr={'20px'}>
                            <Image style={{ borderRadius: "10px" }} src={offer.product.mainPhoto} height={50} width={100} alt="Product image" />
                            <Box>
                              <Text noOfLines={1} ml={'10px'} casing={'capitalize'} fontSize={'18px'} fontWeight={'600'}>
                                {offer.product.title}
                              </Text>
                              <Text fontWeight={'500'} fontSize={'16px'}>{offer.message}</Text>
                              <Text ml={'10px'} casing={'capitalize'} fontSize={'15px'} fontWeight={'500'}>
                                &#8358; {offer.product.price}
                              </Text>
                              <Tag ml={'10px'} colorScheme='red' casing={'capitalize'} fontSize={'12px'} fontWeight={'500'}>
                                Not Accepted
                              </Tag>
                            </Box>
                          </Box>
                          <AccordionIcon color={'orange'} />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={'10px'}>
                        <Text color={'orange'} fontSize={'12px'} fontWeight={'500'}>Description: </Text>
                        <Text fontWeight={'500'} fontSize={'16px'}>
                          {offer.product.description}
                        </Text>
                        <Text color={'orange'} fontWeight={'500'} alignItems={'center'} display={'flex'} fontSize={'12px'}>Message: </Text>
                        <Text fontWeight={'500'} fontSize={'16px'}>{offer.message}</Text>
                        <Box py={'10px'} w={'full'} h={'auto'} display={'flex'} justifyContent={'space-between'}>
                          <Button h={'35px'} isLoading={mutation.isLoading} fontSize={'12px'} leftIcon={<MdRemoveRedEye />} onClick={() => handleReject(offer.id)}>
                            Reject
                          </Button>
                          <Button h={'35px'} isLoading={mutation.isLoading}  fontSize={'12px'} color={'white'} colorScheme={'orange'} leftIcon={<MdCall />} onClick={() => handleAccept(offer.id)}>
                            Accept
                          </Button>
                        </Box>
                      </AccordionPanel>
                    </AccordionItem>
                  ))
                ) : (
                  <Text textAlign={'center'} color={'orange'}>No pending offers found</Text>
                )}
              </Accordion>
            </TabPanel>
            <TabPanel>
              <Accordion allowToggle allowMultiple={false}>
                {acceptedOffers.length > 0 ? (
                  acceptedOffers.map((offer) => (
                    <AccordionItem key={offer.id}>
                      <h2>
                        <AccordionButton h={'auto'}>
                          <Box flex="1" textAlign="left" display={'flex'} alignItems={'center'} justifyContent={''} pr={'20px'}>
                            <Image style={{ borderRadius: "10px" }} src={offer.product.mainPhoto} height={50} width={100} alt="Product image" />
                            <Box>
                              <Text noOfLines={1} ml={'10px'} casing={'capitalize'} fontSize={'18px'} fontWeight={'600'}>
                                {offer.product.title}
                              </Text>
                              <Text ml={'10px'} casing={'capitalize'} fontSize={'15px'} fontWeight={'500'}>
                                &#8358; {offer.product.price}
                              </Text>
                              <Tag ml={'10px'} colorScheme='green' casing={'capitalize'} fontSize={'12px'} fontWeight={'500'}>
                                Accepted
                              </Tag>
                            </Box>
                          </Box>
                          <AccordionIcon color={'orange'} />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={'10px'}>
                        <Text color={'orange'} fontSize={'12px'} fontWeight={'500'}>Description: </Text>
                        <Text fontWeight={'500'} fontSize={'16px'}>
                          {offer.product.description}
                        </Text>
                        <Text color={'orange'} fontWeight={'500'} alignItems={'center'} display={'flex'} fontSize={'12px'}>Message: </Text>
                        <Text fontWeight={'500'} fontSize={'16px'}>{offer.message}</Text>
                        <Box py={'10px'} w={'full'} h={'auto'} display={'flex'} justifyContent={'space-between'}>
                          <Button h={'35px'} fontSize={'12px'} leftIcon={<MdRemoveRedEye />}>
                            Delete
                          </Button>
                          <Button h={'35px'} fontSize={'12px'} color={'white'} colorScheme={'orange'} leftIcon={<MdCall />}>
                            Mark as Sold
                          </Button>
                        </Box>
                      </AccordionPanel>
                    </AccordionItem>
                  ))
                ) : (
                  <Text textAlign={'center'} color={'orange'}>No accepted offers found</Text>
                )}
              </Accordion>
            </TabPanel>
          </TabPanels>
        )}
      </Tabs>
      <Bottom />
    </Box>
  );
}
