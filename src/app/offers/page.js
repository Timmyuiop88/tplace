'use client';
import Bottom from "@/components/BottomNav";
import { Box, Button, Text, Accordion, Spinner, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Tabs, TabList, TabPanels, Tab, TabPanel, Tag, Skeleton } from "@chakra-ui/react";
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
<Image src={'/img/logo-light.png'} alt="logo" width={200} height={400} />
        <Text mr={'20px'} fontSize={'15px'} fontWeight={'600'}>
          Offers
        </Text>
      </Box>
      <Tabs py={'10px'} variant='soft-rounded' colorScheme='orange' w={'full'} pb={'80px'}>
        <TabList justifyContent={'center'}>
          <Tab>Pending Offers</Tab>
          <Tab>Accepted Offers</Tab>
        </TabList>
        {loading? <Box px={'20px'}>
        <Skeleton borderRadius={'10px'} w={'full'} h={'70px'} mt={'10px'} />
        </Box> : 
           <TabPanels>
          <TabPanel>
            <Accordion allowToggle allowMultiple={false}>
              {pendingOffers.length > 0 ? (
                pendingOffers.map((offer) => (
                  <AccordionItem key={offer.id}>
                    <h2>
                      <AccordionButton h={'auto'}>
                        <Box flex="1" textAlign="left" display={'flex'} alignItems={'center'} justifyContent={''} pr={'20px'}>
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
                        <Box flex="1" textAlign="left" display={'flex'} alignItems={'center'} justifyContent={''} pr={'20px'}>
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
                        <Button h={'35px'} fontSize={'12px'} leftIcon={<MdRemoveRedEye />}>
                          View Contact
                        </Button>
                        <Button h={'35px'} fontSize={'12px'} color={'white'} colorScheme={'orange'} leftIcon={<MdCall />}>
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
        }
     
      </Tabs>
      <Bottom />
    </Box>
  );
}
