"use client";
import Ads from "@/components/Ads";
import Bottom from "@/components/BottomNav";
import Header from "@/components/Header";
import Categories from "@/components/categories";
import Products from "@/components/Products";
import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log('Session status:', status);
    
    if (status === 'unauthenticated') {
      console.log('Not authenticated, redirecting to login');
      router.push('/login');
    }
  }, [status, router]);

  if (status === "loading") {
    return <Loading />
  }

  if (status === "unauthenticated") {
    return null; // or a message
  }

  return (
    <Box position={'relative'} pb={'80px'}>
      <Header/>
      <Ads/>
      <Categories/>
      <Products/>
      <Bottom/>
    </Box>
  );
}