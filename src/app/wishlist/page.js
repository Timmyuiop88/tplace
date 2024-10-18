'use client'
import Bottom from "@/components/BottomNav";
import { Box, Button,Text,  Accordion,Spinner,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon, 
    Tabs, TabList, TabPanels, Tab, TabPanel ,Tag,
    SimpleGrid
} from "@chakra-ui/react"
import { IoChevronBackSharp } from "react-icons/io5";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from "next/image";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";
import { MdCall,MdRemoveRedEye } from "react-icons/md";


export default function Offers(){
    const router = useRouter();
    const { data: session, status } = useSession();
  
    const [loading, setLoading] = useState(false);
    const [wishlist, setWishlist] = useState([]);
    const [products, setProducts] = useState([]);
  
    useEffect(() => {
      const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      setWishlist(storedWishlist);
    }, []);
  
    useEffect(() => {
      if (wishlist.length > 0) {
        const fetchProducts = async () => {
          try {
            const response = await axios.post('/api/products-by-ids', {
              ids: wishlist,
            });
           
            setProducts(response.data);
            setLoading(false)
          } catch (error) {
            console.error('Failed to fetch wishlist products', error);
          }
        };
        fetchProducts();
      }
    }, [wishlist]);
  
  
      if (loading || status === "loading") {

        return <Loading />;
      }
    
      if (!session) {
        router.push('/login')
      }
    
  
    return(
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
    Wishlist
</Text>
</Box>

<SimpleGrid minChildWidth={['150px', '200px', '300px', '350px']} spacing='10px' justifyContent={'center'}>
        {products.length === 0 ? (
          <Text>No items in wishlist.</Text>
        ) : (
          products.map((product) => (
            <Box
              key={product.id}
              position={'relative'}
              height='auto'
              display='flex'
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
              borderRadius={'10px'}
            >
              <Image
                src={product.mainPhoto}
                alt={product.title}
                width={500}
                height={300}
                style={{ borderRadius: '10px' }}
              />
              <Box w={'full'} h={'auto'}>
                <Text noOfLines={1} textAlign={'left'} fontSize={'20'} fontWeight={'600'}>
                  {product.title}
                </Text>
              </Box>
              <Box w={'full'} h={'auto'}>
                <Text textAlign={'left'} fontSize={'15'} fontWeight={'600'}>
                  ${product.price}
                </Text>
              </Box>
              <Box w={'full'} h={'auto'} py={'5px'}>
                <Text textAlign={'left'} fontSize={'12px'} fontWeight={'600'}>
                  {product.description}
                </Text>
              </Box>
              <Link href={`/products/${product.id}`}>
                <Text textAlign={'left'} fontSize={'12px'} fontWeight={'600'} color='blue.500'>
                  View Product
                </Text>
              </Link>
            </Box>
          ))
        )}
      </SimpleGrid>


<Bottom/>
        </Box>

    )
}