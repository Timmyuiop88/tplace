"use client";

import { useState, useEffect } from "react";
import Bottom from "@/components/BottomNav";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Heading,
  Text,
  useToast,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from "@chakra-ui/react";
import { BsCashCoin, BsCheckCircle } from "react-icons/bs";
import useUser from "../hooks/useUser";
import { SingleImageDropzone } from "@/components/singleImage";
import { useEdgeStore } from "@/app/edgeProvider";
import { PinInput, PinInputField } from "@chakra-ui/react";

const KYCStatusBanner = ({ status }) => {
  const statusConfig = {
    pending: {
      color: "orange",
      icon: BsCashCoin,
      title: "Application Pending",
      description: "Your vendor application is under review."
    },
    approved: {
      color: "green",
      icon: BsCheckCircle,
      title: "Application Approved",
      description: "Congratulations! Your vendor application has been approved."
    },
    rejected: {
      color: "red",
      icon: BsCashCoin,
      title: "Application Rejected",
      description: "Your vendor application was not successful."
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Alert 
      status={config.color === 'orange' ? 'warning' : config.color === 'green' ? 'success' : 'error'}
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="200px"
      borderRadius="xl"
      mb={6}
    >
      <AlertIcon as={config.icon} boxSize="40px" color={`${config.color}.500`} mb={4} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        {config.title}
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        {config.description}
      </AlertDescription>
    </Alert>
  );
};

export default function Become() {
  const toast = useToast();
  const router = useRouter();
  const { edgestore } = useEdgeStore();
  const {
    user,
    isEmailVerified,
    sendVerificationCodeMutation,
    confirmVerificationCodeMutation,
    isConfirming,
    isLoading,
    kycStatus,
    isKYCLoading
  } = useUser();

  const [email, setEmail] = useState(user?.email);
  const [verificationCode, setVerificationCode] = useState("");
  const [kycFront, setKycFront] = useState(null);
  const [kycBack, setKycBack] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prioritize KYC status check
  useEffect(() => {
    if (isKYCLoading) {
      return;
    }
    
    if (kycStatus && ['pending', 'approved', 'rejected'].includes(kycStatus)) {
      return;
    }
  }, [kycStatus, isKYCLoading]);

  const handleSendVerification = () => {
    if (user?.email) {
      sendVerificationCodeMutation(user.email, {
        onSuccess: () => {
          setTimer(60);
          toast({
            title: "Verification Code Sent",
            status: "info",
            duration: 3000,
            position: "top"
          });
        }
      });
    }
  };

  const handleVerifyCode = () => {
    confirmVerificationCodeMutation({
      email: user?.email,
      code: verificationCode,
    });
  };

  const handleKycSubmit = async () => {
    if (!kycFront || !kycBack) {
      toast({
        title: "Missing Documents",
        description: "Please upload both front and back of your ID",
        status: "warning",
        duration: 3000,
        position: "top"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const [frontUploadRes, backUploadRes] = await Promise.all([
        edgestore.publicFiles.upload({ file: kycFront }),
        edgestore.publicFiles.upload({ file: kycBack })
      ]);

      const response = await fetch("/api/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          idFrontUrl: frontUploadRes.url,
          idBackUrl: backUploadRes.url,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit KYC documents");

      toast({
        title: "KYC Submitted",
        description: "Your documents are being reviewed",
        status: "success",
        duration: 5000,
        position: "top"
      });

      router.push('/');
    } catch (error) {
      toast({
        title: "Submission Error",
        description: error.message,
        status: "error",
        duration: 5000,
        position: "top"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isKYCLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  // Render KYC status if exists
  if (kycStatus) {
    return (
      <Box>
        <Header />
        <Box px={6} py={4}>
          <KYCStatusBanner status={kycStatus} />
          <Button 
            w="full" 
            colorScheme="purple" 
            onClick={() => router.push('/')}
          >
            Return to Home
          </Button>
        </Box>
        <Bottom />
      </Box>
    );
  }

  return (
    <Box>
      <Header />
      <VStack px={6} spacing={6}>
        <HStack justifyContent="center" alignItems="center" spacing={3}>
          <Heading color="teal.500">Become a Vendor</Heading>
          <BsCashCoin />
        </HStack>

        {/* Email Verification Section */}
        <VStack w="full" spacing={4}>
          <FormControl>
            <FormLabel>Email Verification</FormLabel>
            <Text fontSize="sm" color="gray.500" textAlign="center" mb={4}>
              Verification code sent to: {user?.email}
            </Text>
            
            <HStack justifyContent="center" mb={4}>
              <PinInput
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e)}
                otp
              >
                {[...Array(6)].map((_, i) => (
                  <PinInputField key={i} />
                ))}
              </PinInput>
            </HStack>

            <VStack spacing={3}>
              <Button
                w="full"
                colorScheme="orange"
                variant="outline"
                onClick={handleSendVerification}
                isDisabled={timer > 0}
              >
                {timer > 0 ? `Resend in ${timer}s` : "Resend Verification Code"}
              </Button>
              
              <Button
                w="full"
                colorScheme="purple"
                onClick={handleVerifyCode}
                isLoading={isConfirming}
                isDisabled={verificationCode.length < 6}
              >
                Verify Code
              </Button>
            </VStack>
          </FormControl>

          {isEmailVerified && (
            <VStack w="full" spacing={4}>
              <Heading fontSize="xl" textAlign="center">
                Submit KYC Documents
              </Heading>
              
              <VStack w="full" spacing={4}>
                <FormControl>
                  <FormLabel>ID Front</FormLabel>
                  <SingleImageDropzone
                    width="100%"
                    height={200}
                    value={kycFront}
                    onChange={(file) => setKycFront(file)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>ID Back</FormLabel>
                  <SingleImageDropzone
                    width="100%"
                    height={200}
                    value={kycBack}
                    onChange={(file) => setKycBack(file)}
                  />
                </FormControl>

                <Button
                  w="full"
                  colorScheme="orange"
                  onClick={handleKycSubmit}
                  isLoading={isSubmitting}
                  isDisabled={!kycFront || !kycBack}
                >
                  Submit KYC Documents
                </Button>
              </VStack>
            </VStack>
          )}
        </VStack>
      </VStack>
      <Bottom />
    </Box>
  );
}