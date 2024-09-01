'use client'
// Supports weights 200-900
import '@fontsource-variable/nunito';
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
const theme = extendTheme({
  fonts: {
    heading: `'Nunito Variable', sans-serif`,
    body: `'Nunito Variable', sans-serif`,
    text: `'Nunito Variable', sans-serif`,
  },
})
export function Providers({ children }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>
}