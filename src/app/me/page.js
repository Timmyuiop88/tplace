"use client"
import Cover from "@/components/Cover";
import Main from "@/components/Main";
import useUser from "../hooks/useUser";
import Loading from "@/components/loading";
import Bottom from "@/components/BottomNav";


export default function App() {
    const { user, loading, error } = useUser();
    if (loading) {
        return <Loading/>
      }
  return (
    <>
    
      <Cover />
      <Main />
      <Bottom/>
    </>
  );
}
