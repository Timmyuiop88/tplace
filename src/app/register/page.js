'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Input,
  List,
  ListItem,
  Spinner,
  Text,
  AbsoluteCenter,
  Alert,
  AlertIcon,
  Heading,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { BsLinkedin } from 'react-icons/bs';
import Image from 'next/image';
import Link from 'next/link';

export default function SignupForm() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!emailRegex.test(form.email)) {
      setError('Invalid email format');
      setLoading(false);
      return;
    }

    if (!passwordRegex.test(form.password)) {
      setError('Password must be at least 8 characters long, including a number, an uppercase and a lowercase letter');
      setLoading(false);
      return;
    }

    if (!phoneRegex.test(form.phoneNumber)) {
      setError('Phone number must be between 10 and 15 digits');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to sign up');

      // Registration successful
      setSuccessMessage('Registration Successful. Redirecting to login in ');
      setCountdown(5);
      // Start countdown
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            router.push('/login');
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <Box
      w="full"
      display="flex"
      flexDirection="row"
      h="auto"
      alignItems="center"
    >
      {/** form */}
      <Box w={['100%', '100%', '500px', '500px']} height="auto" p="20px">
        <Box w="100%">
          <Box
            w="full"
            h="auto"
            bg="white"
            className="logo & button"
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
          >
            <Image src={'/img/logo.png'} alt="logo" width={140} height={300} />

            <HStack display="flex" flexDirection="row" spacing="20px">
              
              
            </HStack>

            <Box position="relative" padding="10px">
              
              <Heading fontSize={'20px'} px="4">Sign Up</Heading>
            </Box>
          </Box>
        </Box>
        <Box w="100%">
          <Box w="full" px="20px" h="auto">
            <List spacing={3}>
              {error && (
                <Alert status="error" mt="4">
                  <AlertIcon />
                  {error}
                </Alert>
              )}
              {successMessage && (
                <Alert status="success" mt="4">
                  <AlertIcon />
                  {successMessage} {countdown}
                </Alert>
              )}
              <ListItem>
                <FormControl>
                  <FormLabel>First Name</FormLabel>
                  <Input type="text" name="firstName" value={form.firstName} onChange={handleChange} required />
                </FormControl>
              </ListItem>

              <ListItem>
                <FormControl>
                  <FormLabel>Last Name</FormLabel>
                  <Input type="text" name="lastName" value={form.lastName} onChange={handleChange} required />
                </FormControl>
              </ListItem>

              <ListItem>
                <FormControl>
                  <FormLabel>Phone Number</FormLabel>
                  <Input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required />
                </FormControl>
              </ListItem>

              <ListItem>
                <FormControl>
                  <FormLabel>Email address</FormLabel>
                  <Input type="email" name="email" value={form.email} onChange={handleChange} required />
                </FormControl>
              </ListItem>

              <ListItem>
                <FormControl>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" name="password" value={form.password} onChange={handleChange} required />
                </FormControl>
              </ListItem>

              <ListItem>
                <Checkbox>
                  <Text fontSize="12px">
                    By creating an account you agree to the{' '}
                    <span style={{ color: '#f68950', textDecoration: 'underline' }}>terms and use</span> of our{' '}
                    <span style={{ color: '#f68950', textDecoration: 'underline' }}>privacy policy.</span>
                  </Text>
                </Checkbox>
              </ListItem>

              <ListItem  flexDirection="column" gap={'10px'} display="flex" justifyContent="center" w="100%" pt="20px">
                <Button
                  bg="#f68950"
                  p="10px"
                  color="white"
                  w="full"
                  fontSize="12px"
                  isLoading={loading}
                  onClick={handleSubmit}
                >
                  Create Account
                </Button>
                <Button>
                <HStack spacing={1}>
                  <FcGoogle /> <Text>Google</Text>
                </HStack>
              </Button>
              </ListItem>

              <ListItem display="flex" justifyContent="center" w="100%" p="20px">
                <Text fontSize="12px">
                  Already have an account?{' '}
                  <span style={{ color: '#f68950', textDecoration: 'underline' }}>
                    <Link href="/login">Log in</Link>
                  </span>
                </Text>
              </ListItem>
            </List>
          </Box>
        </Box>
      </Box>

      {/** side design */}
      <Center
        w="full"
        height="100vh"
        bg="white"
        display={['none', 'none', 'flex', 'flex']}
        p="20px"
        justifyContent="center"
        alignItems="center"
      >
        <Image alt="side logo" src="/authlogo.svg" width={500} height={300} />
      </Center>
    </Box>
  );
}
