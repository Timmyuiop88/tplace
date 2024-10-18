'use client'
import { redirect, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
    List,
    ListItem,
    Alert,
    AlertIcon,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Center,
    Box,
    Button,
    HStack,
    Text,
    Divider,
    AbsoluteCenter,
    Heading
} from '@chakra-ui/react';
import { FcGoogle } from "react-icons/fc";
import { BsLinkedin } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";
import { useState } from 'react';
import { useSession } from "next-auth/react";


export default function Page() {

    const router = useRouter();
    const { data: session, status } = useSession();
    if (session?.user) router.push('/');
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);


    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        let valid = true;

        if (!validateEmail(email)) {
            setEmailError("Must be an email");
            valid = false;
        } else {
            setEmailError(null);
        }

        if (!validatePassword(password)) {
            setPasswordError("Password must be at least 6 characters");
            valid = false;
        } else {
            setPasswordError(null);
        }

        if (!valid) {
            setLoading(false);
            return;
        }

        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        setLoading(false);

        if (res.error) {
            setError(res.error);
        } else {
            router.push('/');
        }
    };

    return (
        <Box
            w={"full"}
            display={"flex"}
            flexDirection={"row"}
            h={"auto"}
            alignItems={"center"}
        >
            {/* form */}
            <Box w={["100%", "100%", "4xl", "4xl"]} height={"auto"} p={"20px"}>
                <Box w={"100%"}>
                    <Box
                        w={"full"}
                        h={"auto"}
                        bg={"rewhited"}
                        className="logo & button"
                        display={"flex"}
                        justifyContent={"center"}
                        flexDirection={"column"}
                        alignItems={"center"}
                    >
                        <Image alt="logo" src={"/img/logo.png"} width={140} height={300} />
                        
                        <HStack display={"flex"} flexDirection={"row"} spacing={"20px"}>
                          
                           
                        </HStack>
                        <Box position="relative" padding="10px">
                        <Heading fontSize={'20px'} px="4">Sign In</Heading> 
                         
                        </Box>
                    </Box>
                </Box>
                <Box w={"100%"}>
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <Box w={"full"} px={"20px"} h={"auto"}>
                            <List spacing={3}>
                                {error && (
                                    <Alert status="error" mt="4">
                                        <AlertIcon />
                                        {error}
                                    </Alert>
                                )}
                                <ListItem>
                                    <FormControl isInvalid={emailError}>
                                        <FormLabel>Email address</FormLabel>
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        {emailError && <Text color="red.500">{emailError}</Text>}
                                    </FormControl>
                                </ListItem>
                                <ListItem>
                                    <FormControl isInvalid={passwordError}>
                                        <FormLabel>Password</FormLabel>
                                        <Input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        {passwordError && <Text color="red.500">{passwordError}</Text>}
                                    </FormControl>
                                </ListItem>
                                <ListItem
                                    display={"flex"}
                                    flexDirection={"row"}
                                    width={"100%"}
                                    justifyContent={"space-around"}
                                >
                                    <Checkbox>
                                        <Text fontSize={"12px"}>Remember me</Text>
                                    </Checkbox>
                                    <Text textAlign={"right"} fontSize={"12px"} color={"#1EB07A"}>
                                        Reset Password?
                                    </Text>
                                </ListItem>
                                <ListItem
                                    display={"flex"}
                                    flexDirection={'column'}
                                    gap={'10px'}
                                    justifyContent={"center"}
                                    w={"100%"}
                                    pt={"20px"}
                                >
                                    <Button


                                        isLoading={loading}
                                        bg={"#f68950"}
                                        p={"10px"}
                                        color={"white"}
                                        w={"full"}
                                        fontSize={"12px"}
                                        type="submit"
                                    >
                                        Log in
                                    </Button>
                                    <Button
                                      w={"full"}
                                    >
                                <HStack spacing={1}>
                                    <FcGoogle /> <Text>Google</Text>
                                </HStack>
                            </Button>
                                </ListItem>
                                <ListItem
                                    display={"flex"}
                                    justifyContent={"center"}
                                    w={"100%"}
                                    p={"20px"}
                                >
                                    <Text fontSize={"12px"}>
                                        Don't have an account yet?{" "}
                                        <span
                                            style={{ color: "#1EB07A", textDecoration: "underline" }}
                                        >
                                            {" "}
                                            <Link href={"./../register"}>New Account</Link>
                                        </span>
                                    </Text>
                                </ListItem>
                            </List>
                        </Box>
                    </form>
                </Box>
            </Box>
            {/* side design */}
            <Center
                w={"full"}
                height={"100vh"}
                bg={"#FAFAFA"}
                display={["none", "none", "flex", "flex"]}
                p={"20px"}
                justifyContent={"center"}
                alignItems={"center"}
            >
                <Image alt="side logo" src={"/authlogo.svg"} width={500} height={300} />
            </Center>
        </Box>
    );
}
