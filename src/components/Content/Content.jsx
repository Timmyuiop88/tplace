"use client";

import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Avatar, 
  Spinner, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  Grid, 
  Flex,
  Divider,
  useToast,
  Switch,
  Icon,
  Container,
  useBreakpointValue
} from "@chakra-ui/react";
import { 
  User, 
  Settings, 
  Bell, 
  Upload, 
  ShieldCheck, 
  CreditCard 
} from "lucide-react";
import { useState, useEffect } from "react";
import useUser from "@/app/hooks/useUser";
import useUpdateUser from "@/app/hooks/useUpdateUser";
import Header from "@/components/Header";
import Bottom from "@/components/BottomNav";

const AccountProfile = () => {
  const toast = useToast();
  const { user, loading: isUserLoading } = useUser();
  const { updateUser, loading: isUpdating, error } = useUpdateUser();

  const [activeSection, setActiveSection] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  // Responsive values
  const avatarSize = useBreakpointValue({ base: "xl", md: "2xl" });
  const gridColumns = useBreakpointValue({ base: "1fr", md: "repeat(2, 1fr)" });
  const spacing = useBreakpointValue({ base: 4, md: 6 });

  // Sync form data with user data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        profileImage: user.profileImage || null
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser(formData);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
        status: "success",
        duration: 3000,
        position: "top"
      });
    } catch (err) {
      toast({
        title: "Update Failed",
        description: error || "Could not update profile",
        status: "error",
        duration: 3000,
        position: "top"
      });
    }
  };

  const renderSection = () => {
    switch(activeSection) {
      case 'profile':
        return (
          <Box as="form" onSubmit={handleProfileUpdate} w="full">
            <VStack spacing={spacing} align="stretch">
              <Flex 
                direction={{ base: "column", md: "row" }}
                align="center" 
                gap={spacing}
              >
                <Avatar 
                  size={avatarSize} 
                  src={formData.profileImage || '/default-avatar.png'}
                />
                <VStack 
                  align={{ base: "center", md: "start" }} 
                  spacing={2} 
                  w="full"
                >
                  <Button 
                    leftIcon={<Upload />} 
                    variant="outline" 
                    colorScheme="orange"
                    w={{ base: "full", md: "auto" }}
                  >
                    Upload Photo
                  </Button>
                  <Text 
                    fontSize="sm" 
                    color="gray.500" 
                    textAlign={{ base: "center", md: "left" }}
                  >
                    Recommended: Square photo, max 5MB
                  </Text>
                </VStack>
              </Flex>

              <Grid 
                templateColumns={gridColumns} 
                gap={spacing}
              >
                <FormControl>
                  <FormLabel>First Name</FormLabel>
                  <Input 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    variant="filled"
                    focusBorderColor="#ffa41d"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Last Name</FormLabel>
                  <Input 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    variant="filled"
                    focusBorderColor="#ffa41d"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    variant="filled"
                    focusBorderColor="#ffa41d"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Phone Number</FormLabel>
                  <Input 
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    variant="filled"
                    focusBorderColor="#ffa41d"
                  />
                </FormControl>
              </Grid>

              <Button 
                type="submit" 
                colorScheme="orange" 
                isLoading={isUpdating}
                w="full"
                bg="#ffa41d"
                _hover={{ bg: "#ff9300" }}
              >
                Update Profile
              </Button>
            </VStack>
          </Box>
        );

      case 'security':
        return (
          <VStack spacing={spacing} align="stretch">
            <Flex 
              bg="orange.50" 
              p={4} 
              borderRadius="md"
              direction={{ base: "column", md: "row" }}
              align="center"
              gap={3}
            >
              <Icon as={ShieldCheck} color="#ffa41d" boxSize={8} />
              <VStack 
                align={{ base: "center", md: "start" }} 
                spacing={1} 
                flex={1}
              >
                <Text fontWeight="bold">Two-Factor Authentication</Text>
                <Text 
                  fontSize="sm" 
                  color="gray.600" 
                  textAlign={{ base: "center", md: "left" }}
                >
                  Add an extra layer of security to your account
                </Text>
              </VStack>
              <Button 
                mt={{ base: 3, md: 0 }} 
                colorScheme="orange" 
                variant="outline"
                w={{ base: "full", md: "auto" }}
              >
                Enable 2FA
              </Button>
            </Flex>

            <FormControl 
              display="flex" 
              flexDirection={{ base: "column", md: "row" }}
              alignItems="center" 
              justifyContent="space-between"
              gap={3}
            >
              <FormLabel m={0}>Login Notifications</FormLabel>
              <Switch colorScheme="orange" />
            </FormControl>
          </VStack>
        );

      case 'notifications':
        return (
          <VStack spacing={spacing} align="stretch">
            <FormControl 
              display="flex" 
              flexDirection={{ base: "column", md: "row" }}
              alignItems="center" 
              justifyContent="space-between"
              gap={3}
            >
              <HStack>
                <Icon as={Bell} color="#ffa41d" />
                <FormLabel m={0}>Email Notifications</FormLabel>
              </HStack>
              <Switch colorScheme="orange" />
            </FormControl>
            <FormControl 
              display="flex" 
              flexDirection={{ base: "column", md: "row" }}
              alignItems="center" 
              justifyContent="space-between"
              gap={3}
            >
              <HStack>
                <Icon as={Bell} color="#ffa41d" />
                <FormLabel m={0}>Push Notifications</FormLabel>
              </HStack>
              <Switch colorScheme="orange" />
            </FormControl>
          </VStack>
        );

      default:
        return null;
    }
  };

  if (isUserLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box>
      <Header />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Flex 
            bg="#ffa41d" 
            color="white" 
            p={6} 
            borderRadius="xl" 
            direction={{ base: "column", md: "row" }}
            align="center"
            gap={4}
          >
            <Avatar 
              size={avatarSize} 
              src={user?.profileImage || '/default-avatar.png'}
            />
            <VStack 
              align={{ base: "center", md: "start" }} 
              spacing={1}
            >
              <Text 
                fontSize={{ base: "xl", md: "2xl" }} 
                fontWeight="bold"
                textAlign={{ base: "center", md: "left" }}
              >
                {user?.firstName} {user?.lastName}
              </Text>
              <Text textAlign={{ base: "center", md: "left" }}>
                {user?.email}
              </Text>
            </VStack>
          </Flex>

          <Flex 
            overflowX="auto" 
            pb={2} 
            gap={2}
            justifyContent={{ base: "center", md: "start" }}
          >
            {[
              { icon: User, label: 'Profile', key: 'profile' },
              { icon: ShieldCheck, label: 'Security', key: 'security' },
              { icon: Bell, label: 'Notifications', key: 'notifications' }
            ].map((item) => (
              <Button
              size={'sm'}
                key={item.key}
                leftIcon={<Icon as={item.icon} />}
                variant={activeSection === item.key ? 'solid' : 'outline'}
                colorScheme="orange"
                onClick={() => setActiveSection(item.key)}
                bg={activeSection === item.key ? "#ffa41d" : undefined}
                _hover={{ 
                  bg: activeSection === item.key ? "#ff9300" : undefined 
                }}
              >
                {activeSection === item.key? item.label : ""}
              </Button>
            ))}
          </Flex>

          <Box 
            bg="white" 
            borderRadius="xl" 
            boxShadow="md" 
            p={8}
          >
            {renderSection()}
          </Box>
        </VStack>
      </Container>
      <Bottom />
    </Box>
  );
};

export default AccountProfile;