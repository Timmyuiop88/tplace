'use client';
import Bottom from "@/components/BottomNav";
import Header from "@/components/Header";
import { useState, useEffect, useCallback } from 'react';
import { 
  Box, Button, Input, InputGroup, Tag, SimpleGrid, 
  InputRightElement, Skeleton, Text, useDisclosure,
  Modal, ModalOverlay, ModalContent, ModalHeader, 
  ModalFooter, ModalBody, ModalCloseButton, 
  Slider, SliderTrack, SliderFilledTrack, 
  SliderThumb, Textarea, useToast, 
  Tooltip, VStack, HStack, Icon
} from "@chakra-ui/react";
import { useProductName } from "../hooks/useProducts";
import Image from "next/image";
import { BsCashCoin } from "react-icons/bs";
import { FaUserCircle, FaHeart, FaRegHeart, FaSearch } from "react-icons/fa";
import { MdOutlineVerified, MdClear } from "react-icons/md";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function EnhancedSearch() {
  const toast = useToast();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Enhanced State Management
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Offer States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [offerAmount, setOfferAmount] = useState(5);
  const [offerMessage, setOfferMessage] = useState('');
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);

  // Fetch Products with Enhanced Loading
  const { 
    products, 
    isLoading: isProductLoading, 
    error: productError 
  } = useProductName(debouncedSearchTerm);

  // Debounce Search Input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm) {
        setDebouncedSearchTerm(searchTerm);
        setIsSearching(true);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Search Interaction Improvements
  const handleSearch = useCallback(() => {
    if (searchTerm) {
      // Add to search history
      const updatedHistory = [
        searchTerm, 
        ...searchHistory.filter(term => term !== searchTerm)
      ].slice(0, 5);
      
      setSearchHistory(updatedHistory);
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(true);
    }
  }, [searchTerm, searchHistory]);

  // Wishlist Management
  const toggleWishlist = (product) => {
    const updatedWishlist = wishlist.some(item => item.id === product.id)
      ? wishlist.filter(item => item.id !== product.id)
      : [...wishlist, product];
    
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  // Offer Submission
  const submitOffer = async (event) => {
    event.preventDefault();
    setIsSubmittingOffer(true);

    try {
      const response = await axios.post('/api/offers', {
        amount: offerAmount,
        message: offerMessage,
        productId: selectedProduct.id,
      });
      
      if (response.status === 201) {
        toast({
          title: 'Offer Created Successfully',
          description: `Offer of $${offerAmount} submitted`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onClose();
      }
    } catch (error) {
      toast({
        title: 'Offer Submission Failed',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  return (
    <VStack spacing={0} w="full">
      <Header />
      <Box w="full" p={4}>
        <InputGroup>
          <Input 
            placeholder="Search Products" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            pr="4.5rem"
            borderRadius="full"
          />
          <InputRightElement>
            <HStack>
              {searchTerm && (
                <Icon 
                  as={MdClear} 
                  color="gray.500" 
                  cursor="pointer" 
                  onClick={() => setSearchTerm('')}
                />
              )}
              <Button 
                onClick={handleSearch} 
                size="sm" 
                borderRadius="full" 
                colorScheme="orange"
              >
                <FaSearch />
              </Button>
            </HStack>
          </InputRightElement>
        </InputGroup>

        {/* Search History Chip */}
        <HStack mt={2} spacing={2} overflowX="auto">
          {searchHistory.map(term => (
            <Tag 
              key={term} 
              variant="subtle" 
              colorScheme="blue"
              cursor="pointer"
              onClick={() => {
                setSearchTerm(term);
                setDebouncedSearchTerm(term);
              }}
            >
              {term}
            </Tag>
          ))}
        </HStack>
      </Box>

      {/* Product Display with Enhanced Loading */}
      <Box w="full" px={4}>
        {isSearching && isProductLoading ? (
          <SimpleGrid columns={[2, 3, 4]} spacing={4}>
            {[...Array(6)].map((_, idx) => (
              <Skeleton key={idx} height="250px" borderRadius="md" />
            ))}
          </SimpleGrid>
        ) : productError ? (
          <Text color="red.500">Error loading products: {productError.message}</Text>
        ) : products && products.length ? (
          <SimpleGrid columns={[2, 3, 4]} spacing={4}>
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                onWishlistToggle={() => toggleWishlist(product)}
                onMakeOffer={() => {
                  setSelectedProduct(product);
                  onOpen();
                }}
                isWishlisted={wishlist.some(item => item.id === product.id)}
              />
            ))}
          </SimpleGrid>
        ) : isSearching ? (
          <Text textAlign="center" color="gray.500">No products found</Text>
        ) : null}
      </Box>

      {/* Offer Modal */}
      {selectedProduct && (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Make an Offer</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={submitOffer}>
              <ModalBody>
                <VStack spacing={4}>
                  <Text>Offer Amount: ${offerAmount}</Text>
                  <Slider 
                    min={0} 
                    max={selectedProduct.price} 
                    value={offerAmount}
                    onChange={setOfferAmount}
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                  
                  <Textarea 
                    placeholder="Your offer message" 
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                  />
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button 
                  type="submit" 
                  colorScheme="orange" 
                  isLoading={isSubmittingOffer}
                >
                  Submit Offer
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      )}

      <Bottom />
    </VStack>
  );
}

// Separate Product Card Component
const ProductCard = ({ product, onWishlistToggle, onMakeOffer, isWishlisted }) => {
  const router = useRouter();

  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      p={3} 
      position="relative" 
      transition="all 0.3s"
      _hover={{ 
        transform: 'scale(1.02)', 
        boxShadow: 'md' 
      }}
    >
      <Icon 
        as={isWishlisted ? FaHeart : FaRegHeart}
        position="absolute" 
        top={2} 
        right={2} 
        color="red.500" 
        cursor="pointer"
        onClick={onWishlistToggle}
      />
      
      <Image 
        src={product.mainPhoto} 
        alt={product.title} 
        width={200} 
        height={200} 
        style={{ 
          borderRadius: '8px', 
          objectFit: 'cover' 
        }}
        onClick={() => router.push(`/product/${product.id}`)}
      />
      
      <VStack align="start" mt={2} spacing={1}>
        <Text fontWeight="bold" noOfLines={1}>{product.title}</Text>
        <Text color="green.500">${product.price}</Text>
        <Button 
          size="sm" 
          colorScheme="orange" 
          onClick={onMakeOffer}
          w="full"
        >
          Make Offer
        </Button>
      </VStack>
    </Box>
  );
};