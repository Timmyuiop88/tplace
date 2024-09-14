import { Box, SimpleGrid, Spinner, Text, Button, Tag,useDisclosure,
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
  useToast,
  Skeleton
 } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BsCashCoin } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineVerified } from "react-icons/md";
import { FaRegHeart,FaHeart } from "react-icons/fa";

import axios from "axios";
import useProducts from "@/app/hooks/useProducts";
export default function Products() {
    

  
  
 
  
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { products, isLoading, wishlist, handleWishlistToggle } = useProducts();
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sliderValue, setSliderValue] = useState(5)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
 
  const router = useRouter();

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    onOpen()
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
    <Box w={"full"} maxW={"7xl"} px={"10px"} py={"10px"} m={"auto"}>
      {products?.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="200px"
        >
          <Text fontSize="xl">No products available</Text>
        </Box>
      ) : (
        <SimpleGrid
          minChildWidth={["150px", "200px", "300px", "350px"]}
          spacing="10px"
          justifyContent={"center"}
        >
          {
          isLoading? (<>
<Skeleton h={'250px'}w={'auto'}   borderRadius={"10px"} />
<Skeleton h={'250px'}w={'auto'}   borderRadius={"10px"}/>
<Skeleton h={'250px'}w={'auto'}    borderRadius={"10px"}/>
<Skeleton h={'250px'}w={'auto'}    borderRadius={"10px"}/>
          </>) : 
            products.map((product) => {
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
              src={product.mainPhoto}
              alt={product.title}
              width={500}
              height={300}
              style={{ borderRadius: "10px" }}
            />
               </Box>
            <Box w={"full"} h={"auto"}  onClick={()=> router.push(`/product/${product.id}`)}>
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
            <Box w={"full"} h={"auto"}  onClick={()=> router.push(`/product/${product.id}`)}>
              <Text textAlign={"left"} fontSize={"15"} fontWeight={"600"}>
                ${product.price}
              </Text>
            </Box>
            <Box w={"full"} h={"auto"} py={"5px"}  onClick={()=> router.push(`/product/${product.id}`)}>
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
      )}
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
    </Box>
  );
}
