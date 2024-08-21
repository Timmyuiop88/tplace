"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { IoChevronBackSharp, IoLocation } from "react-icons/io5";
import Image from "next/image";
import useUser from "@/app/hooks/useUser";
import { FaHeart, FaClock, FaStar } from "react-icons/fa";
import { Avatar, Center } from '@chakra-ui/react'
import Bottom from "@/components/BottomNav";
import { MdCall, MdRemoveRedEye } from "react-icons/md";
import { BsCashCoin } from "react-icons/bs";
import {
  Box, SimpleGrid, Spinner, Text, Button, Tag, useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Textarea,
  useToast
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useProductsID } from "@/app/hooks/useProducts";
import Loading from "@/components/loading";
import { useSession } from 'next-auth/react';

const ProductList = ({ params }) => {
  const { data: session, status } = useSession();
  const { products, isFetching, error: errors } = useProductsID(parseInt(params.id));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const [sliderValue, setSliderValue] = useState(5);
  const toast = useToast();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');

  const handleBackClick = () => {
    router.back();
  };
  const productId = params?.slug; // Handle potential undefined params
  const { user, loading, error } = useUser();

  console.log(params.id);

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (isFetching) return <Loading />;


  
  return (
   <>

     <Box
     w={'full'}
     h={'auto'}
     display={'flex'}
     flexDirection={'column'}
   >
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
       <Button onClick={handleBackClick} color={'white'} bg={'none'} leftIcon={<IoChevronBackSharp />}>
         Back
       </Button>
       <Text mr={'20px'} fontSize={'15px'} fontWeight={'600'}>
         Offers
       </Text>
     </Box>
     {products ? (
     <Box
       w={'full'}
       h={'auto'}
       px={'24px'}
       display={'flex'}
       flexDirection={'column'}
       alignItems={'center'}
       gap={'24px'}
       pt={'40px'}
       overflowY={'scroll'}
       mb={20}
     >
       {/** carousel */}
       <Box
         bg={'white'}
         gap={'20px'}
         sx={{
           "::-webkit-scrollbar": {
             display: "none",
           },
         }} display={'flex'} w={'full'} h={300} justifyContent={'center'} overflowX={'scroll'}
       >
         <Image

             src={products.mainPhoto}
             alt={products.title}
             width={500}
             height={300}
             style={{ borderRadius: "10px" }}
           />
         {products.photos.map((photo, index) => (
           <Image
             key={index}
             src={photo}
             width={300}
             height={400}
             alt={`Product photo ${index + 1}`} // Add an alt attribute for accessibility
             style={{ borderRadius: '12px' }}
           />
         ))}
       </Box>

       {/** user name and heart section */}
       <Box
         display={'flex'}
         justifyContent={'space-between'}
         maxWidth={'7xl'}
         w={'full'}
         flexDirection={'column'}
       >
         <Box
           display={'flex'}
           justifyContent={'space-between'}
           w={'full'}
           
         >
           <Box
             h={'auto'}
             width={'full'}
             display={'flex'}
             flexDirection={'row'}
     
    pb={'10px'}
             gap={'5px'}
           >
             <Avatar name={products.user.firstName} w={'32px'} fontSize={'8px'} h={'32px'} borderRadius={'24px'} />
             <Box>
               <Text ml={'5px'} fontWeight={700} fontSize={'15px'}>
                 {products.user.firstName}
               </Text>
               <Text  ml={'5px'} fontSize={'12px'}>{products.createdAt}</Text>
             </Box>
           </Box>

           <Box
             h={'inherit'}
             width={'20px'}
             p={'12px'}
             display={'flex'}
             justifyContent={'flex-end'} // Aligns the content horizontally at the end
             alignItems={'center'} // Vertically centers the icon within the box
           >
           
           </Box>
         </Box>

         <Box
     
           w={'full'}
           display={'flex'}
           flexDirection={'row'}
           justifyContent={'space-between'}
           alignItems={'center'}
           gap={'12px'}

         >
           <Box
        
             display={'flex'}
             alignItems={'center'}
             gap={'4px'}
             w={'auto'}

           >
             <IoLocation fill="orange" />
             <Text fontWeight={700} fontSize={'12px'}>{products.state}</Text>
           </Box>

           <Box
             w={'auto'}
             display={'flex'}
             alignItems={'center'}
             gap={'8px'}
             justifyContent={'flex-end'}
           >
             <FaClock fill="orange" />
             <Text fontSize={'12px'}>{products.createdAt}</Text>
           </Box>

           <Box
             w={'auto'}
             display={'flex'}
             alignItems={'center'}
             gap={'4px'}
             justifyContent={'flex-end'}
           >
             <FaStar fill="orange" />
             <Text fontSize={'12px'}>5</Text>
           </Box>
         </Box>
       </Box>

       {/** description */}
       <Box
       h={'auto'}
         w={'full'}
         maxW={'7xl'}
         display={'flex'}
         flexDirection={'column'}
       >
         <Text fontWeight={700} fontSize={'18px'}>Description</Text>
         <Text fontSize={'12px'}>{products.description}</Text>
       </Box>

       {/** buttons */}
       <Box py={'10px'} w={'full'} h={'auto'} display={'flex'}      maxW={'7xl'}justifyContent={'space-between'}>
         <Button h={'35px'} fontSize={'12px'} leftIcon={<MdRemoveRedEye />}>
           View Contact
         </Button>
         <Button onClick={onOpen} h={'35px'} fontSize={'12px'} color={'white'} colorScheme={'orange'} leftIcon={<BsCashCoin />}>
           Make offer
         </Button>

         {isOpen && (<Modal isOpen={isOpen} onClose={onClose} w={'80%'} autoFocus={false} allowPinchZoom={false}>
           <ModalOverlay />
           <ModalContent w={'80%'}>
             <ModalHeader>Make offer</ModalHeader>
             <ModalCloseButton />
             <form onSubmit={handleSubmit}>
               <ModalBody>
                 {successMessage && <Text color='green.500' mt='4'>{successMessage}</Text>}
                 {errorMessage && <Text color='red.500' mt='4'>{errorMessage}</Text>}
                 <Text m={'auto'} w={'150px'} textAlign={'center'}>
                   <Text fontSize={'20px'} fontWeight={'500'}>&#8358;{sliderValue}
                   </Text>
                   Offer
                 </Text>
                 <Slider

                   min={0}
                   max={isOpen.price}
                   colorScheme='teal'
                   onChange={(v) => setSliderValue(v)}
                   onMouseEnter={() => setShowTooltip(true)}
                   onMouseLeave={() => setShowTooltip(false)}
                   aria-label='slider-ex-4' defaultValue={30}>
                   <SliderTrack bg='red.100'>
                     <SliderFilledTrack bg='tomato' />
                   </SliderTrack>
                   <SliderThumb boxSize={6}>
                     <Box color='tomato' as={BsCashCoin} />
                   </SliderThumb>
                 </Slider>
                 <Text textAlign={'center'}>
                   Asking Price: &#8358;{isOpen.price}
                 </Text>

                 <Textarea
                   fontSize={'16px'}
                   value={message}
                   onChange={(e) => setMessage(e.target.value)}
                   my={'10px'}
                   placeholder='Offer Message'
                   size='sm'
                   resize={'none'}
                 />
               </ModalBody>

               <ModalFooter>
                 <Button colorScheme='blue' mr={3} onClick={onClose}>
                   Close
                 </Button>
                 <Button type='submit' isLoading={isSubmitting} bg="#f68950" color={'white'} variant='solid'>Make Offer</Button>
               </ModalFooter>
             </form>
           </ModalContent>
         </Modal>)}
       </Box>

       {/** map */}
       <Box
         w={'full'}
         maxW={'7xl'}
         display={'flex'}
         flexDirection={'column'}
         gap={'12px'}
       >
         <Box
           display={'flex'}
           alignItems={'center'}
         >
           <IoLocation fill="orange" /><Text fontWeight={700} fontSize={'12px'}>Main Location</Text>
         </Box>
         <Box
           w={'full'}
           h={'200px'}
           bg={'grey'}
           borderRadius={'12px'}
         ></Box>
       </Box>

     </Box>
   ) : <Center  h={'100vh'}>
    <Text fontSize={'25px'}>Product Not Found</Text>
    </Center>}
     <Bottom />
   </Box>

   </>
  );
};

export default ProductList;
