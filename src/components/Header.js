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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const {user} = useUser()
  return (
    <Box
      px={"20px"}
      display={"flex"}
      flexDirection={"row-reverse"}
      alignItems={"center"}
      bg={"orange"}
      h={["70px", "70px", "70px", "80px"]}
      w={"full"}
    >
      <IconButton
        icon={<TiThMenuOutline />}
        ref={btnRef}
        bg="white"
        color={"orange"}
        onClick={onOpen}
      />

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <Box h={'auto'} w={"full"} bg={"orange"} display={'flex'} alignItems={'center'} p={'20px'} pt={'40px'}>
            <StatsCard
              title={"TradePoints"}
              stat={user?.points}
              icon={<FaCircleDollarToSlot size={"3em"} />}
            />
          </Box>
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
          <DrawerBody></DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
