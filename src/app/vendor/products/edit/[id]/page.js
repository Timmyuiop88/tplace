'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Button, Input, Textarea, FormControl, FormLabel, useToast, Spinner, VStack } from "@chakra-ui/react";
import axios from "axios";
import useProducts, { useProductsID } from "@/app/hooks/useProducts";
import Header from "@/components/Header"; // Reusing the same header for consistency

export default function EditProduct({ params }) {
  const router = useRouter();
  const id = parseInt(params.id); // Get product ID from URL
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { products: productData, isFetching, error: errors,refetchID } = useProductsID(id);
const {refetch} = useProducts()
  const [updatedProduct, setUpdatedProduct] = useState({
    title: '',
    description: '',
    price: '', // Add price field in the state
  });

  useEffect(() => {
    if (productData) {
      setUpdatedProduct({
        title: productData.title || '',
        description: productData.description || '',
        price: productData.price || '', // Initialize price from productData
      });
    }
  }, [productData]);

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      await axios.patch(`/api/products-by-ids?id=${productData?.id}`, {
        id: productData?.id,
        title: updatedProduct.title,
        description: updatedProduct.description,
        price: parseFloat(updatedProduct.price), // Ensure price is passed as a float
      }); // Update product details
      
      toast({
        title: "Product updated successfully!",
        status: "success",
        isClosable: true,
      });
      refetch()
      router.push("/"); // Redirect to the product list
    } catch (error) {
      toast({
        title: "Error updating product.",
        status: "error",
        description: error.message,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching || !updatedProduct.title) {
    return (
      <Box textAlign="center" py="100px">
        <Spinner size="lg" />
        <Box mt={4}>Loading product details...</Box>
      </Box>
    );
  }

  return (
    <>
      <Header />
      <Box maxW="600px" mx="auto" mt="8" p="6" boxShadow="lg" borderRadius="md" bg="white">
        <VStack spacing={6}>
          <FormControl isRequired>
            <FormLabel>Product Title</FormLabel>
            <Input
              value={updatedProduct.title}
              onChange={(e) => setUpdatedProduct({ ...updatedProduct, title: e.target.value })}
              placeholder="Enter product title"
              focusBorderColor="teal.500"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Product Description</FormLabel>
            <Textarea
              value={updatedProduct.description}
              onChange={(e) => setUpdatedProduct({ ...updatedProduct, description: e.target.value })}
              placeholder="Enter product description"
              focusBorderColor="teal.500"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Product Price</FormLabel>
            <Input
              type="number"
              value={updatedProduct.price}
              onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: e.target.value })}
              placeholder="Enter product price"
              focusBorderColor="teal.500"
            />
          </FormControl>

          <Button
            colorScheme="teal"
            width="full"
            onClick={handleUpdate}
            isLoading={isSubmitting}
            loadingText="Updating"
          >
            Update Product
          </Button>
        </VStack>
      </Box>
    </>
  );
}
