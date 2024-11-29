import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";
import NextAuthSessionProvider from "./next-auth-provider";
import React from "react";
import { ReactQueryProvider } from "./queryProvider";
import { EdgeStoreProvider } from "./edgeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Trade Place",
  description: "Buying and selling the easiest way",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
        ></meta>
      </head>

      <body className={inter.className}>
      <NextAuthSessionProvider>
        <ReactQueryProvider>
  
            <EdgeStoreProvider>
                 <Providers>{children}</Providers>
            </EdgeStoreProvider>
         
 
        </ReactQueryProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
