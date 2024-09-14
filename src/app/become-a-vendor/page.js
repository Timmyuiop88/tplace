"use client";

import { useState } from "react";
import Bottom from "@/components/BottomNav";
import Header from "@/components/Header";
import {
  Box,
  Button,
  Heading,
  Text,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepSeparator,
  StepTitle,
} from "@chakra-ui/react";
import { BsCashCoin } from "react-icons/bs";
import { useSteps } from "@chakra-ui/react";
import useUser from "../hooks/useUser"; // Adjust import path as needed
import { SingleImageDropzone } from "@/components/singleImage";
import { useEdgeStore } from "@/app/edgeProvider";

const steps = [
  { title: "Email Verification", description: "Verify your email address" },
  { title: "KYC", description: "Submit your KYC documents" },
];

export default function Become() {
  const { user, isEmailVerified, sendVerificationCodeMutation, isVerifying, confirmVerificationCodeMutation, isConfirming } = useUser();
  const { edgestore } = useEdgeStore(); // Access edge store
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState(user?.email);
  const [verificationCode, setVerificationCode] = useState("");
  const [kycFront, setKycFront] = useState(null);
  const [kycBack, setKycBack] = useState(null);
  const toast = useToast();

  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleSendVerification = (email) => {
    if (email) {
      sendVerificationCodeMutation(email);
    }
  };

  const handleVerifyCode = () => {
    confirmVerificationCodeMutation({ email: user?.email, code: verificationCode });
  };

  const handleKycSubmit = async () => {
    if (kycFront && kycBack) {
      try {
        // Upload KYC front and back images
        const frontUploadRes = await edgestore.publicFiles.upload({
          file: kycFront,
        });
  
        const backUploadRes = await edgestore.publicFiles.upload({
          file: kycBack,
        });
  
        // Check if uploads were successful
        if (!frontUploadRes.url || !backUploadRes.url) {
          throw new Error('Failed to upload one or both KYC documents');
        }
  
        // Post KYC data to your API
        const response = await fetch('/api/kyc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user?.id,
            idFrontUrl: frontUploadRes.url,
            idBackUrl: backUploadRes.url,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to submit KYC documents');
        }
  
        toast({
          title: "KYC Submitted",
          description: "Your KYC documents have been submitted.",
          status: "success",
          duration: 5000,
          position:'top-right',
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          position:'top-right',
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Both KYC documents are required.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  

  return (
    <Box>
      <Header />
      <Box px={"20px"}>
        <Box
          h={"40px"}
          display={"flex"}
          gap={"10px"}
          fontSize={"20px"}
          justifyContent={"center"}
          w={"full"}
          alignItems={"center"}
        >
          <Heading textAlign={"center"} color={"teal"}>
            Become a Vendor
          </Heading>
          <BsCashCoin />
        </Box>

        <Stepper colorScheme={"purple"} pt={"20px"} index={activeStep}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>

              <Box flexShrink="0">
                <StepTitle>{step.title}</StepTitle>
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>

        <Box h={'auto'} pt={6}>
          {activeStep === 0 && (
            <Box>
              {!isEmailVerified ? (
                <>
                  <FormControl>
                    <FormLabel>Email Verification</FormLabel>
                    <Box pb={'10px'} w={'full'} display={'flex'} justifyContent={'space-between'}>
                      <Text>{user?.email}</Text>
                    </Box>
                    <Input
                      placeholder="Enter Verification Code"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                  </FormControl>
                  <Box pt={'10px'} w={'full'} display={'flex'} justifyContent={'space-between'}>
                    <Button
                      isLoading={isVerifying}
                      w={'auto'}
                      px={'5px'}
                      colorScheme="teal"
                      onClick={() => handleSendVerification(user?.email)}
                    >
                      Send Verification Code
                    </Button>
                    <Button
                      isLoading={isConfirming}
                      w={'auto'}
                      px={'5px'}
                      colorScheme="teal"
                      onClick={handleVerifyCode}
                    >
                      Verify Code
                    </Button>
                  </Box>
                </>
              ) : (
                <Text>Email is verified. You may proceed to the next step.</Text>
              )}

              <Button
                mt={6}
                colorScheme="purple"
                onClick={handleNextStep}
                isDisabled={!user?.emailVerified}
              >
                Next
              </Button>
            </Box>
          )}

          {activeStep === 1 && (
            <Box h={'auto'} pb={'100px'}>
              <Heading fontSize="lg" mb={4}>
                Submit your KYC Documents
              </Heading>
              <FormControl mb={4}>
                <FormLabel>ID Front</FormLabel>
                <SingleImageDropzone
                  width={200}
                  height={200}
                  value={kycFront}
                  onChange={(file) => setKycFront(file)}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>ID Back</FormLabel>
                <SingleImageDropzone
                  width={200}
                  height={200}
                  value={kycBack}
                  onChange={(file) => setKycBack(file)}
                />
              </FormControl>

              <Button
                colorScheme="teal"
                onClick={handleKycSubmit}
                isDisabled={!kycFront || !kycBack}
              >
                Submit KYC
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      <Bottom />
    </Box>
  );
}
