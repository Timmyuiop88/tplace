import { Box } from "@chakra-ui/react";
import Image from "next/image";

export default function Ads() {
  return (
  <>
  <Box
bg={'white'}
gap={'20px'}
sx={{
"::-webkit-scrollbar": {
display: "none",
},
}}
display={'flex'}
maxWidth={'7xl'}
m={'auto'}
w={'full'}
h={'auto'}
p={'20px'}
justifyContent={'space-between'}
overflowX={'scroll'}
>

<Box borderRadius={'10px'} h={'auto'} minW={'250px'} w={"auto"}>
<Image
src="https://files.edgestore.dev/bqsxgvb7g9fo4g4o/publicFiles/_public/471ed9b8-bf3f-405f-aa70-b533579f0899.jpg"
alt="Traveling this Christmas but need a place to stay?"
borderRadius={'10px'}
width={300}
height={160}
/>
</Box>
<Box borderRadius={'10px'} h={'auto'} minW={'250px'} w={"auto"}>
<Image
src="https://files.edgestore.dev/bqsxgvb7g9fo4g4o/publicFiles/_public/471ed9b8-bf3f-405f-aa70-b533579f0899.jpg"
alt="Traveling this Christmas but need a place to stay?"
borderRadius={'10px'}
width={300}
height={160}
/>
</Box>
<Box borderRadius={'10px'} h={'auto'} minW={'250px'} w={"auto"}>
<Image
src="https://files.edgestore.dev/bqsxgvb7g9fo4g4o/publicFiles/_public/471ed9b8-bf3f-405f-aa70-b533579f0899.jpg"
alt="Traveling this Christmas but need a place to stay?"
borderRadius={'10px'}
width={300}
height={160}
/>
</Box>
</Box>
  </>
  );
}
