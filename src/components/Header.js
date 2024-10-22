import {
  Box,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Button,
  IconButton,
  useColorModeValue,
  Input,
  Text
} from "@chakra-ui/react";
import { GiShoppingCart } from "react-icons/gi";
import { BiSolidOffer } from "react-icons/bi";
import { RiBillLine } from "react-icons/ri";

import Image from "next/image";
import { useRef } from "react";
import { TiThMenuOutline } from "react-icons/ti";
import { FaCircleDollarToSlot } from "react-icons/fa6";
import useUser from "@/app/hooks/useUser";
import Link from "next/link";
import { MdOutlineAddBox } from "react-icons/md";
import { useRouter } from "next/navigation";
function StatsCard(props) {
  const router =useRouter()
  const { title, stat, icon } = props;
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={"5"}
      shadow={"xl"}
      border={"1px solid"}
      borderColor={useColorModeValue("gray.800", "gray.500")}
      rounded={"lg"}
    >
      <Flex justifyContent={"space-between"}>
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight={"medium"} isTruncated color={'white'}>
            {title}
          </StatLabel>
          <StatNumber fontSize={"2xl"} fontWeight={"medium"} color={'white'}>
            {stat}
          </StatNumber>
        </Box>
        <Box
          my={"auto"}
          color={useColorModeValue("white")}
          alignContent={"center"}
        >
          {icon}
        </Box>
      </Flex>
      <Button onClick={()=>router.push('/topup')} color={'orange'} size={'xs'} fontSize={'10px'} mt={'10px'} ml={'10px'}>Topup</Button>
    </Stat>
  );
}
export default function Header() {
  const router =useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const {user} = useUser()
  return (
    <Box
      px={"10px"}
      display={"flex"}
    justifyContent={'space-between'}
      alignItems={"center"}
      bg={"orange"}
      h={["70px", "70px", "70px", "80px"]}
      w={"full"}
    >

<Button _active={{
  bg: 'none'
}} p={0} m={0}    onClick={onOpen} bg={'none'} height={'auto'} w={'auto'}>
<svg xmlns="http://www.w3.org/2000/svg" width="27" height="28" viewBox="0 0 27 28" fill="none" aria-hidden="true" focusable="false"><path d="M3.375 8.375H23.625" stroke="white" stroke-width="1.5" stroke-linecap="round"></path><path d="M3.375 14H23.625" stroke="white" stroke-width="1.5" stroke-linecap="round"></path><path d="M3.375 19.625H23.625" stroke="white" stroke-width="1.5" stroke-linecap="round"></path></svg>
 
</Button>
<Image src={'/img/logo-light.png'} alt="logo" width={140} height={300} />
<Button onClick={()=> router.push('/search')}  p={0} m={0} bg={'none'} height={'auto'} w={'auto'}>
<svg xmlns="http://www.w3.org/2000/svg" width="27" height="28" viewBox="0 0 27 28" fill="none"><path d="M26.6958 25.7272C27.1014 26.1328 27.1014 26.7903 26.6958 27.1958C26.2903 27.6014 25.6328 27.6014 25.2272 27.1958L20.2426 22.2112C19.8371 21.8057 19.8371 21.1482 20.2426 20.7426C20.6482 20.3371 21.3057 20.3371 21.7112 20.7426L26.6958 25.7272ZM11.0077 22.5154C4.92831 22.5154 0 17.5871 0 11.5077C0 5.42831 4.92831 0.5 11.0077 0.5C17.0871 0.5 22.0154 5.42831 22.0154 11.5077C22.0154 17.5871 17.0871 22.5154 11.0077 22.5154ZM11.0077 20.4385C15.94 20.4385 19.9385 16.44 19.9385 11.5077C19.9385 6.57536 15.94 2.57692 11.0077 2.57692C6.07536 2.57692 2.07692 6.57536 2.07692 11.5077C2.07692 16.44 6.07536 20.4385 11.0077 20.4385ZM5.88462 10.6769C5.88462 11.0593 5.57466 11.3692 5.19231 11.3692C4.80996 11.3692 4.5 11.0593 4.5 10.6769C4.5 7.54165 7.04165 5 10.1769 5C10.5593 5 10.8692 5.30996 10.8692 5.69231C10.8692 6.07466 10.5593 6.38462 10.1769 6.38462C7.80635 6.38462 5.88462 8.30635 5.88462 10.6769Z" fill="white"></path></svg>

  </Button>


      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
        
      >
        <DrawerOverlay />
        <DrawerContent overflowY={'scroll'}>
          <DrawerCloseButton />
          <Box h={'auto'} w={"full"} bg={"orange"} display={'flex'} alignItems={'center'} p={'20px'} pt={'40px'}>
            <StatsCard
              title={"TradePoints"}
              stat={user?.points}
              icon={<FaCircleDollarToSlot size={"3em"} />}
            />
          </Box>
          <DrawerHeader>Trader</DrawerHeader>

<Link  href={'/become-a-vendor'}>
<Box

px={'20px'}
w={'full'}
bg={'grey.100'}
>
  <Button
  colorScheme={'purple'}
  rightIcon={<BiSolidOffer />}
  >
     Become a Vendor
  </Button>
</Box>
</Link>
          <DrawerHeader>Vendor</DrawerHeader>
<Link href={'/vendor/create-product'}>
<Box
px={'20px'}
w={'full'}
bg={'grey.100'}
>
  <Button
  rightIcon={<MdOutlineAddBox />}
  >
    Create Product
  </Button>
</Box>
</Link>
<Link  href={'/vendor/offers'}>
<Box
pt={
  '10px'
}
px={'20px'}
w={'full'}
bg={'grey.100'}
>
  <Button
  rightIcon={<BiSolidOffer />}
  >
     Offers
  </Button>
</Box>
</Link>
<Link  href={'/vendor/products'}>
<Box
pt={
  '10px'
}
px={'20px'}
w={'full'}
bg={'grey.100'}
>
  <Button
  rightIcon={<GiShoppingCart />}
  >
     Products
  </Button>
</Box>
</Link>
<Link  href={'/vendor/history'}>
<Box
pt={
  '10px'
}
px={'20px'}
w={'full'}
bg={'grey.100'}
>
  <Button
  rightIcon={<RiBillLine />}
  >
     Billing History
  </Button>
</Box>
</Link>
          <DrawerBody></DrawerBody>

       
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
