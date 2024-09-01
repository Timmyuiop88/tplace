'use client';
import Bottom from "@/components/BottomNav";
import Header from "@/components/Header";
import { useState } from 'react';
import { AiOutlineEdit } from "react-icons/ai";

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

 // Import your custom hook
 import {  useEffect } from "react";
 import Image from "next/image";
 import { BsCashCoin } from "react-icons/bs";
 import { FaUserCircle } from "react-icons/fa";
 import { MdOutlineVerified } from "react-icons/md";
 import { FaRegHeart,FaHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useProductOwner } from "@/app/hooks/useProducts";

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
  const { ownerProducts, isLoading, error } = useProductOwner();
 



  return (
    <>
      <Header />
      <Box pb={'100px'}>
       

        <Box px={'10px'} display={'flex'} justifyContent={'center'} mt={4}>
          <Box w={'full'} maxW={'5xl'}>
            {isLoading  ? (
              // Display skeleton when loading
            <>
            <Skeleton borderRadius={'10px'} pt={'10px'} mb={'10px'} height="100px" />
              <Skeleton borderRadius={'10px'} height="100px" />
            </>  
            ) : ownerProducts && ownerProducts.length > 0 ? (
              // Display products in a list
              <Box as="ul" listStyleType="none" p={0}>
                 <SimpleGrid
          minChildWidth={["150px", "200px", "300px", "350px"]}
          spacing="10px"
          justifyContent={"center"}
        >
          {ownerProducts.map((product) => {
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
            
                bg="#f68950"
                color={"white"}
                alignItems={"center"}
                w={"100%"}
                rightIcon={<AiOutlineEdit />}
              >
           Edit
              </Button>
            </Box>
          </Box>
          )
           
})}
       
       
        
        </SimpleGrid>
              </Box>
            ) :  (
              // Display "Not Found" message if no products are found
              <Text>No products found.</Text>
            )}
          </Box>
        </Box>
      </Box>
    
      <Bottom />
    </>
  );
}
