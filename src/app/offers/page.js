'use client';
import Bottom from "@/components/BottomNav";
import { Box, Button, Text, Accordion, Spinner, AccordionItem, AccordionButton, Drawer,
  DrawerBody,
  Input,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton, AccordionPanel,useToast, AccordionIcon, useDisclosure, Tabs, TabList, TabPanels, Tab, TabPanel, Tag, Skeleton, 
  SkeletonText} from "@chakra-ui/react";
import { IoChevronBackSharp } from "react-icons/io5";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from "next/image";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";
import { MdCall, MdRemoveRedEye } from "react-icons/md";
import { useProductsID } from "../hooks/useProducts";

export default function Offers() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  
  // Fetch offers once session is authenticated
  useEffect(() => {
    if (session) {
      fetchOffers();
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [session, status]);

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

  const [viewId, setViewID] = useState(null);
  const { products, isFetching, error: errors } = useProductsID(parseInt(viewId));

  const pendingOffers = offers.filter(offer => !offer.accepted);
  const acceptedOffers = offers.filter(offer => offer.accepted);

  // Update viewId and open drawer
  const requestCall = (id) => {
    setViewID(id);
    onOpen();
  };


  const [isLoading, setIsLoading] = useState(false); // Loading state for the button
  const toast = useToast();

  const requestCallBack = async (offerId, productId) => {
    setIsLoading(true); // Set loading to true when the request starts
    try {
      // Send the callback request to the server
      const response = await fetch('/api/createCallBack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          offerId: offerId,
          productId: productId,
          userId: session?.user?.id, // Assuming session contains user ID
        }),
      });

      if (response.ok) {
        // Handle success (show toast notification)
        toast({
          title: 'Callback Request Sent',
          description: 'Your callback request has been successfully submitted.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to send callback request');
      }
    } catch (error) {
      // Handle error (show toast notification)
      toast({
        title: 'Error',
        description: 'There was an issue with the callback request.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false); // Set loading to false once the request is complete
    }
  };
  return (
    <Box h={'100vh'} w={'100%'} maxW={'7xl'} m={'auto'} bg={'white'}>
      <Box
        px={'10px'}
        w={'full'}
        h={["70px", "70px", "70px", "80px"]}
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
        <Image src={'/img/logo-light.png'} alt="logo" width={140} height={300} />
        <Text mr={'20px'} fontSize={'15px'} fontWeight={'600'}>
          Offers
        </Text>
      </Box>
      <Tabs py={'10px'} variant='soft-rounded' colorScheme='orange' w={'full'} pb={'80px'}>
        <TabList justifyContent={'center'}>
          <Tab>Pending Offers</Tab>
          <Tab>Accepted Offers</Tab>
        </TabList>
        {loading ? (
          <Box px={'20px'}>
            <Skeleton borderRadius={'10px'} w={'full'} h={'70px'} mt={'10px'} />
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
                          <Box flex="1" textAlign="left" display={'flex'} alignItems={'center'} pr={'20px'}>
                            <Image style={{ borderRadius: "10px" }} src={offer.product.mainPhoto} height={50} width={100} />
                            <Box>
                              <Text noOfLines={1} ml={'10px'} casing={'capitalize'} fontSize={'18px'} fontWeight={'600'}>
                                {offer.product.title}
                              </Text>
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
                          <Button isDisabled={!offer.accepted} h={'35px'} fontSize={'12px'} leftIcon={<MdRemoveRedEye />}>
                            View Contact
                          </Button>
                          <Button isDisabled={!offer.accepted} h={'35px'} fontSize={'12px'} color={'white'} colorScheme={'orange'} leftIcon={<MdCall />}>
                            Request Callback
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
                          <Box flex="1" textAlign="left" display={'flex'} alignItems={'center'} pr={'20px'}>
                            <Image style={{ borderRadius: "10px" }} src={offer.product.mainPhoto} height={50} width={100} />
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
                          <Button
                            ref={btnRef} onClick={() => requestCall(offer.productId)} // Pass function reference instead of calling it directly
                            h={'35px'} fontSize={'12px'} leftIcon={<MdRemoveRedEye />}>
                            View Contact
                          </Button>
                          <Button
      isDisabled={isLoading} // Disable button while loading
      isLoading={isLoading} // Show loading spinner when loading
      loadingText="Requesting"
      h={'35px'}
      fontSize={'12px'}
      color={'white'}
      colorScheme={'orange'}
      leftIcon={<MdCall />}
      onClick={() => requestCallBack(offer.id, parseInt(offer.productId))} // Pass offer ID and product ID
    >
      Request Callback
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
      
      <Drawer
  isOpen={isOpen}
  placement="bottom"
  onClose={onClose}
  finalFocusRef={btnRef}
>
  <DrawerOverlay />
  <DrawerContent>
    <DrawerCloseButton />
    <DrawerHeader>Product Owner Details</DrawerHeader>

    <DrawerBody>
      {/* Product Owner Details */}
      <Box display="flex" flexDirection="column" alignItems="flex-start" py={4}>
        {/* Owner's Name */}
        {isFetching ? <SkeletonText/> :  <Text fontSize="16px" fontWeight="600">
    
    {products?.user.firstName} {products?.user.lastName}
  </Text> }
       

        {/* Owner's Email */}
        <Box display="flex" alignItems="center" mt={2}>
          <Text fontSize="14px" fontWeight="500" mr={2}>
            Email:
          </Text>
          <Text fontSize="14px" color="blue.500" isTruncated>
            {products?.user.email}
          </Text>
        </Box>

        {/* Owner's Phone Number */}
       
          <Box display="flex" alignItems="center" mt={2}>
            <Text fontSize="14px" fontWeight="500" mr={2}>
              Phone:
            </Text>
            <Text fontSize="14px" isTruncated>
              {products?.user.phoneNumber || 'Not Available'}
            </Text>
          </Box>
    

        {/* WhatsApp Icon to Open Chat */}
        
          <Box display="flex" alignItems="center" mt={4}>
            <Button
              colorScheme="whatsapp"
              leftIcon={<MdCall />}
              onClick={() => window.open(`https://wa.me/${products.user.phoneNumber || null}`)}
              size="sm"
            >
              Contact via WhatsApp
            </Button>
          </Box>
     
      </Box>
    </DrawerBody>

    <DrawerFooter>
      <Button variant="outline" mr={3} onClick={onClose}>
        Close
      </Button>
    </DrawerFooter>
  </DrawerContent>
</Drawer>

    </Box>
  );
}
