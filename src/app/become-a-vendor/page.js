"use client";

import { useState, useEffect } from "react";
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
  PinInput,
  PinInputField
} from "@chakra-ui/react";
import { BsCashCoin } from "react-icons/bs";
import useUser from "../hooks/useUser";
import { SingleImageDropzone } from "@/components/singleImage";
import { useEdgeStore } from "@/app/edgeProvider";
import Header from "@/components/Header";
import Bottom from "@/components/BottomNav";

export default function BecomeVendor() {
  const [isVerifying, setIsVerifying] = useState(false);
  
  const toast = useToast();
  const router = useRouter();
  const { edgestore } = useEdgeStore();
  const {
    user,
    isEmailVerified,
    sendVerificationCodeMutation,
    confirmVerificationCodeMutation,
    isConfirming
  } = useUser(setIsVerifying);

  // State management for multi-step form
  const [currentStep, setCurrentStep] = useState(0);
  const [verificationCode, setVerificationCode] = useState("");
  const [kycFront, setKycFront] = useState(null);
  const [kycBack, setKycBack] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kycStatus, setKycStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check email verification and KYC status on mount
  useEffect(() => {
    const checkStatusAndVerification = async () => {
      try {
        // First, check KYC status
        const kycResponse = await fetch('/api/kyc');
        const kycData = await kycResponse.json();

        if (kycResponse.ok && kycData.status) {
          // If KYC status exists, set it and stop further steps
          setKycStatus(kycData.status);
          setCurrentStep(3); // Final step
        } else {
          // Check if email is already verified
          if (isEmailVerified) {
            setCurrentStep(1); // Move to document upload step
          }
        }
      } catch (error) {
        console.error('Error checking status:', error);
        toast({
          title: "Error",
          description: "Failed to check application status",
          status: "error",
          duration: 3000,
          position: "top"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.email) {
      checkStatusAndVerification();
    } else {
      setIsLoading(false);
    }
  }, [user, isEmailVerified, toast]);

  // Countdown timer for verification code
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

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
      onSuccess: () => {
        setCurrentStep(1); // Move to document upload step
        toast({
          title: "Email Verified",
          status: "success",
          duration: 3000,
          position: "top"
        });
      }
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

      setCurrentStep(3); // Move to final step
      setKycStatus('pending');
      toast({
        title: "KYC Submitted",
        description: "Your documents are being reviewed",
        status: "success",
        duration: 5000,
        position: "top"
      });
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
  if (isLoading) {
    return (
      <Box>
        <Header />
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Spinner size="xl" />
        </Box>
        <Bottom />
      </Box>
    );
  }

  // Render based on current step
  const renderStep = () => {
    switch (currentStep) {
      case 0: // Email Verification
        return (
          <VStack w="full" spacing={4}>
            <FormControl>
              <FormLabel>Email Verification</FormLabel>
              <Text fontSize="sm" color="gray.500" textAlign="center" mb={4}>
                Verification code will be sent to: {user?.email}
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
                  {timer > 0 ? `Resend in ${timer}s` : "Send Verification Code"}
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
          </VStack>
        );

      case 1: // Document Upload
        return (
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
        );

      case 3: // KYC Status
        return (
          <VStack spacing={4}>
            <Heading>KYC Application Status</Heading>
            <Text 
              color={
                kycStatus === 'approved' ? 'green.500' :
                kycStatus === 'pending' ? 'orange.500' :
                'red.500'
              }
            >
              Status: {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
            </Text>
            <Button 
              w="full" 
              colorScheme="purple" 
              onClick={() => router.push('/')}
            >
              Return to Home
            </Button>
          </VStack>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Header />
      <VStack px={6} spacing={6}>
        <HStack justifyContent="center" alignItems="center" spacing={3}>
          <Heading color="teal.500">Become a Vendor</Heading>
          <BsCashCoin />
        </HStack>

        {renderStep()}
      </VStack>
      <Bottom />
    </Box>
  );
}