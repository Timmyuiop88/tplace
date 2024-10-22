'use client';
import Bottom from "@/components/BottomNav";
import Header from "@/components/Header";
import { useState } from 'react';
import { AiOutlineEdit } from "react-icons/ai";
import { Box, Button, Input, InputGroup, Tag, SimpleGrid, InputRightElement, Skeleton, Text, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineVerified } from "react-icons/md";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useProductOwner } from "@/app/hooks/useProducts";

export default function Search() {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { ownerProducts, isLoading, error, refetchOwn } = useProductOwner();
  const [isDeleting, setIsDeleting] = useState(false); // For tracking delete operation
  const [confirmDeleteProduct, setConfirmDeleteProduct] = useState(null); // Track product to delete
  const router = useRouter();

  const handleEditProduct = (productId) => {
    router.push(`/vendor/products/edit/${productId}`);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setIsDeleting(true);
      await axios.delete(`/api/products-by-ids?id=${productId}`); // Adjust the API route based on your backend setup
      toast({
        title: "Product deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      refetchOwn()
      // Optionally, refresh or update the list after deletion
      router.refresh();
    } catch (error) {
      toast({
        title: "Error deleting product.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
      setConfirmDeleteProduct(null);
      onClose();
    }
  };

  const handleOpenDeleteModal = (product) => {
    setConfirmDeleteProduct(product);
    onOpen();
  };

  return (
    <>
      <Header />
      <Box pb={'100px'}>
        <Box px={'10px'} display={'flex'} justifyContent={'center'} mt={4}>
          <Box w={'full'} maxW={'5xl'}>
            {isLoading ? (
              <>
                <Skeleton borderRadius={'10px'} pt={'10px'} mb={'10px'} height="100px" />
                <Skeleton borderRadius={'10px'} height="100px" />
              </>
            ) : ownerProducts && ownerProducts.length > 0 ? (
              <Box as="ul" listStyleType="none" p={0}>
                <SimpleGrid minChildWidth={["150px", "200px", "300px", "350px"]} spacing="10px" justifyContent={"center"}>
                  {ownerProducts.map((product) => (
                    <Box key={product.id} position={'relative'} minHeight={["300px", "400px", "500px", "500px"]} display="flex" flexDirection="column" alignItems="center" justifyContent="space-between" borderRadius={"10px"}>
                      <Box
                        cursor="pointer"
                        bg={'white'}
                        borderRadius={'50%'}
                        top={5}
                        right={5}
                        color={'red'}
                        zIndex={999}
                        position={'absolute'}
                        h={'auto'}
                        w={'auto'}
                        p={'5px'}
                      >
                        {JSON.parse(localStorage.getItem('wishlist'))?.includes(product.id) ? <FaHeart /> : <FaRegHeart />}
                      </Box>
                      <Box maxH={'150px'} maxW={'300px'} overflow={'hidden'}>
                        <Image onClick={() => router.push(`/product/${product.id}`)} src={product.mainPhoto} alt={product.title} width={500} height={300} style={{ borderRadius: "10px" }} />
                      </Box>
                      <Box w={"full"} h={"auto"}>
                        <Text casing={'capitalize'} noOfLines={1} textAlign={"left"} fontSize={"20"} fontWeight={"600"}>{product.title}</Text>
                      </Box>
                      <Box w={"full"} h={"auto"}>
                        <Text textAlign={"left"} fontSize={"15"} fontWeight={"600"}>&#8358;{product.price}</Text>
                      </Box>
                      <Box w={"full"} h={"auto"} py={"5px"}>
                        <Text textAlign={"left"} fontSize={"12px"} fontWeight={"600"}>{product.description}</Text>
                      </Box>
                      <Box w={"full"} h={"auto"} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                        <Box display={"flex"} alignItems={"center"}>
                          <FaUserCircle />
                          <Text ml={"5px"} textAlign={"left"} fontSize={"12px"} fontWeight={"600"}>{product.user.firstName}</Text>
                        </Box>
                        <Tag size={"small"}><MdOutlineVerified /></Tag>
                      </Box>
                      <Box w={"full"} py={"10px"} display="flex" justifyContent="space-between">
                        <Button onClick={() => handleEditProduct(product.id)} bg="#f68950" color={"white"} w={"45%"} rightIcon={<AiOutlineEdit />}>Edit</Button>
                        <Button onClick={() => handleOpenDeleteModal(product)} colorScheme="red" w={"45%"}>Delete</Button>
                      </Box>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            ) : (
              <Text>No products found.</Text>
            )}
          </Box>
        </Box>
      </Box>

      {/* Delete confirmation modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete <strong>{confirmDeleteProduct?.title}</strong>? This action cannot be undone.</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3}>Cancel</Button>
            <Button colorScheme="red" isLoading={isDeleting} onClick={() => handleDeleteProduct(confirmDeleteProduct.id)}>Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Bottom />
    </>
  );
}
