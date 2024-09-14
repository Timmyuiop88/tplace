"use client"
import { Box,Button,Text } from "@chakra-ui/react";
import Create from "./create";
import { IoChevronBackSharp } from "react-icons/io5";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function Page(){
    const router = useRouter();
    return(
        <Box position={'relative'} pb={'100px'} h={'auto'} w={'100%'} maxW={'7xl'} m={'auto'} bg={'white'}>
<Box
position={
    'fixed'
}
mb={'150px'}
zIndex={'999'}
left={0}
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
<Image src={'/img/logo-light.png'} alt="logo" width={200} height={400} />

</Box>

               <Create/>
        </Box>
     
    )
}