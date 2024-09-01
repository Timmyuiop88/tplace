'use client';
import Bottom from "@/components/BottomNav";
import Header from "@/components/Header";
import { useState } from 'react';
import { Box, Button, Input, InputGroup,Tag, SimpleGrid,InputRightElement, Skeleton, Text

    ,useDisclosure,
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
import { useProductName } from "../hooks/useProducts";
 // Import your custom hook
 import {  useEffect } from "react";
 import Image from "next/image";
 import { BsCashCoin } from "react-icons/bs";
 import { FaUserCircle } from "react-icons/fa";
 import { MdOutlineVerified } from "react-icons/md";
 import { FaRegHeart,FaHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Search() {
    const toast = useToast()
  const [searchTerm, setSearchTerm] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const [sliderValue, setSliderValue] = useState(5)
  const [showTooltip, setShowTooltip] = useState(false)
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { products, isLoading } = useProductName(searchTerm);
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    onOpen()
  };

  const handleSearch = () => {
    if (searchTerm) {
      setTriggerSearch(true);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await axios.post('/api/offers', {
        amount : sliderValue,
        message,
        productId: selectedProduct.id,
      });
      
      if (response.status === 201) {
        onClose()
        setSuccessMessage('Offer created successfully!');
        toast({
            title: 'Offer created successfully!',
            status: 'success',
            position: 'top-right',
            duration: 9000,
            isClosable: true,
          })
        
      }
    } catch (error) {
      setErrorMessage('Failed to create offer.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <Header />
      <Box pb={'100px'}>
        <Box px={'10px'} display={'flex'} justifyContent={'center'} alignItems={'center'} height={'60px'} w={'full'}>
          <InputGroup w={'full'} maxW={'5xl'}>
            <Input

            borderRadius={'20px'}
              px='8'
              placeholder='Search Anything'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Handle input change
            />
            <InputRightElement>
            <Button borderRadius={'50%'}  p={0} m={0} bg={'orange'} onClick={handleSearch} height={'full'} w={'auto'}>
<svg xmlns="http://www.w3.org/2000/svg" width="27" height="28" viewBox="0 0 27 28" fill="none"><path d="M26.6958 25.7272C27.1014 26.1328 27.1014 26.7903 26.6958 27.1958C26.2903 27.6014 25.6328 27.6014 25.2272 27.1958L20.2426 22.2112C19.8371 21.8057 19.8371 21.1482 20.2426 20.7426C20.6482 20.3371 21.3057 20.3371 21.7112 20.7426L26.6958 25.7272ZM11.0077 22.5154C4.92831 22.5154 0 17.5871 0 11.5077C0 5.42831 4.92831 0.5 11.0077 0.5C17.0871 0.5 22.0154 5.42831 22.0154 11.5077C22.0154 17.5871 17.0871 22.5154 11.0077 22.5154ZM11.0077 20.4385C15.94 20.4385 19.9385 16.44 19.9385 11.5077C19.9385 6.57536 15.94 2.57692 11.0077 2.57692C6.07536 2.57692 2.07692 6.57536 2.07692 11.5077C2.07692 16.44 6.07536 20.4385 11.0077 20.4385ZM5.88462 10.6769C5.88462 11.0593 5.57466 11.3692 5.19231 11.3692C4.80996 11.3692 4.5 11.0593 4.5 10.6769C4.5 7.54165 7.04165 5 10.1769 5C10.5593 5 10.8692 5.30996 10.8692 5.69231C10.8692 6.07466 10.5593 6.38462 10.1769 6.38462C7.80635 6.38462 5.88462 8.30635 5.88462 10.6769Z" fill="white"></path></svg>

  </Button>
            </InputRightElement>
          </InputGroup>
        </Box>

        <Box px={'10px'} display={'flex'} justifyContent={'center'} mt={4}>
          <Box w={'full'} maxW={'5xl'}>
            {isLoading && triggerSearch ? (
              // Display skeleton when loading
            <>
            <Skeleton mb={'10px'} height="70px" />
              <Skeleton height="70px" />
            </>  
            ) : products && products.length > 0 ? (
              // Display products in a list
              <Box as="ul" listStyleType="none" p={0}>
                 <SimpleGrid
          minChildWidth={["150px", "200px", "300px", "350px"]}
          spacing="10px"
          justifyContent={"center"}
        >
          {products.map((product) => {
            const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            const isProductInWishlist = wishlist.some(item => item.id === product.id);
          return(
            <Box
          
       
            key={product.id}
        position={'relative'}
     height={'auto'}
            minHeight={["300px","400px","500px","500px"]}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
          
            borderRadius={"10px"}
          >
              <Box  onClick={() => handleWishlistToggle(product.id)}
        cursor="pointer" bg={'white'} borderRadius={'50%'} top={5} right={5} color={'red'} zIndex={999} position={'absolute'} h={'auto'} w={'auto'}
              p={'5px'}
              >
                {wishlist.includes(product.id) ? <FaHeart /> : <FaRegHeart />}
              </Box>
              <Box maxH={'150px'} maxW={'300px'}
              overflow={'hidden'}
              >

           
            <Image
              onClick={()=> router.push(`/product/${product.id}`)}
              src={product.mainPhoto}
              alt={product.title}
              width={500}
              height={300}
              style={{ borderRadius: "10px" }}
            />
               </Box>
            <Box w={"full"} h={"auto"}>
              <Text
              casing={'capitalize'}
                noOfLines={1}
                textAlign={"left"}
                fontSize={"20"}
                fontWeight={"600"}
              >
                {product.title}
              </Text>
            </Box>
            <Box w={"full"} h={"auto"}>
              <Text textAlign={"left"} fontSize={"15"} fontWeight={"600"}>
                ${product.price}
              </Text>
            </Box>
            <Box w={"full"} h={"auto"} py={"5px"}>
              <Text textAlign={"left"} fontSize={"12px"} fontWeight={"600"}>
                {product.description}
              </Text>
            </Box>
            <Box
              w={"full"}
              h={"auto"}
              py={"5px"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Box display={"flex"} alignItems={"center"}>
                <FaUserCircle />
                <Text
                  ml={"5px"}
                  textAlign={"left"}
                  fontSize={"12px"}
                  fontWeight={"600"}
                >
                  {product.user.firstName}
                </Text>
              </Box>
              <Tag size={"small"}>
                {" "}
                <MdOutlineVerified />
              </Tag>
            </Box>
            <Box w={"full"} py={"10px"}>
              <Button
              onClick={() => handleProductClick(product)}
                bg="#f68950"
                color={"white"}
                alignItems={"center"}
                w={"100%"}
                rightIcon={<BsCashCoin />}
              >
                Make offer
              </Button>
            </Box>
          </Box>
          )
           
})}
       
       
        
        </SimpleGrid>
              </Box>
            ) : triggerSearch ? (
              // Display "Not Found" message if no products are found
              <Text>No products found.</Text>
            ) : null}
          </Box>
        </Box>
      </Box>
      {selectedProduct && (
       <Modal isOpen={isOpen} onClose={onClose} w={'80%'} autoFocus={false} allowPinchZoom={false}>
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
      max={selectedProduct.price}
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
          Asking Price: &#8358;{selectedProduct.price}
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
            <Button       type='submit'    isLoading={isSubmitting}   bg="#f68950" color={'white'}variant='solid'>Make Offer</Button>
          </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
       )}
      <Bottom />
    </>
  );
}
