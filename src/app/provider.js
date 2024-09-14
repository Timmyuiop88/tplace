'use client';

import '@fontsource-variable/nunito'; // Ensure this is properly installed
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

// Extend the theme using Chakra's proper structure
const theme = extendTheme({
  fonts: {
    heading: `'Nunito Variable', sans-serif`,
    body: `'Nunito Variable', sans-serif`,
  },
  components: {
    Button: {
     
      // Overriding styles specifically for the "solid" variant
      variants: {
        solid: {
         
      
          _hover: {
            bg: 'primary', // Change background on hover for solid variant
          },
          _active: {
            bg: 'primary', // Change background when active for solid variant
          },
        },
      },
    },
  },
});

export function Providers({ children }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
