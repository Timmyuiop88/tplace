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
  Divider,
  useToast,
  Switch,
  Icon,
  Container
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
            <VStack spacing={6} align="stretch">
              <HStack spacing={6} align="center">
                <Avatar 
                  size="2xl" 
                  src={formData.profileImage || '/default-avatar.png'}
                />
                <VStack align="start" spacing={2}>
                  <Button 
                    leftIcon={<Upload />} 
                    variant="outline" 
                    colorScheme="orange"
                  >
                    Upload Photo
                  </Button>
                  <Text fontSize="sm" color="gray.500">
                    Recommended: Square photo, max 5MB
                  </Text>
                </VStack>
              </HStack>

              <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                <FormControl>
                  <FormLabel>First Name</FormLabel>
                  <Input 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    variant="filled"
                    focusBorderColor="orange.500"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Last Name</FormLabel>
                  <Input 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    variant="filled"
                    focusBorderColor="orange.500"
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
                    focusBorderColor="orange.500"
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
                    focusBorderColor="orange.500"
                  />
                </FormControl>
              </Grid>

              <Button 
                type="submit" 
                colorScheme="orange" 
                isLoading={isUpdating}
                w="full"
              >
                Update Profile
              </Button>
            </VStack>
          </Box>
        );

      case 'security':
        return (
          <VStack spacing={6} align="stretch">
            <HStack bg="orange.50" p={4} borderRadius="md">
              <Icon as={ShieldCheck} color="orange.500" boxSize={8} />
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold">Two-Factor Authentication</Text>
                <Text fontSize="sm" color="gray.600">
                  Add an extra layer of security to your account
                </Text>
              </VStack>
              <Button ml="auto" colorScheme="orange" variant="outline">
                Enable 2FA
              </Button>
            </HStack>

            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <FormLabel>Login Notifications</FormLabel>
              <Switch colorScheme="orange" />
            </FormControl>
          </VStack>
        );

      case 'notifications':
        return (
          <VStack spacing={6} align="stretch">
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <HStack>
                <Icon as={Bell} color="orange.500" />
                <FormLabel ml={2}>Email Notifications</FormLabel>
              </HStack>
              <Switch colorScheme="orange" />
            </FormControl>
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <HStack>
                <Icon as={Bell} color="orange.500" />
                <FormLabel ml={2}>Push Notifications</FormLabel>
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
          <HStack 
            bg="orange.500" 
            color="white" 
            p={6} 
            borderRadius="xl" 
            spacing={6}
          >
            <Avatar 
              size="xl" 
              src={user?.profileImage || '/default-avatar.png'}
            />
            <VStack align="start" spacing={1}>
              <Text fontSize="2xl" fontWeight="bold">
                {user?.firstName} {user?.lastName}
              </Text>
              <Text>{user?.email}</Text>
            </VStack>
          </HStack>

          <HStack spacing={4} overflowX="auto" pb={2}>
            {[
              { icon: User, label: 'Profile', key: 'profile' },
              { icon: ShieldCheck, label: 'Security', key: 'security' },
              { icon: Bell, label: 'Notifications', key: 'notifications' }
            ].map((item) => (
              <Button
                key={item.key}
                leftIcon={<Icon as={item.icon} />}
                variant={activeSection === item.key ? 'solid' : 'outline'}
                colorScheme="orange"
                onClick={() => setActiveSection(item.key)}
              >
                {item.label}
              </Button>
            ))}
          </HStack>

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