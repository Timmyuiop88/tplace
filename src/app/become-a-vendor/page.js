"use client";

import { useState } from "react";
import Bottom from "@/components/BottomNav";
import Header from "@/components/Header";
import {
  Box,
  Button,
  Heading,
  Input,
  Text,
  useToast,
  Flex,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepSeparator,
  StepTitle,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { BsCashCoin } from "react-icons/bs";
import { useSteps } from "@chakra-ui/react";
import useUser from "../hooks/useUser";
// Assume this hook provides user info like email verification status

const steps = [
  { title: "Email Verification", description: "Verify your email address" },
  { title: "KYC", description: "Submit your KYC documents" },
];

export default function Become() {
  const { user, isEmailVerified, sendVerificationCode } = useUser(); // Assume user and email verification come from a hook
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState(user?.email);
  const [kycFront, setKycFront] = useState(null);
  const [kycBack, setKycBack] = useState(null);
  const toast = useToast();

  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleSendVerification = () => {
    if (email) {
      sendVerificationCode(email); // Send verification code logic
      toast({
        title: "Verification Code Sent",
        description: `A code has been sent to ${email}`,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleKycSubmit = () => {
    if (kycFront && kycBack) {
      // Logic to upload KYC files to the server
      toast({
        title: "KYC Submitted",
        description: "Your KYC documents have been submitted.",
        status: "success",
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

        <Box pt={6}>
          {/* Step Content */}
          {activeStep === 0 && (
            <Box>
              {!isEmailVerified ? (
                <FormControl>
                  <FormLabel>Email Verification</FormLabel>
                  <Input
                  readOnly
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button
                    mt={4}
                    colorScheme="teal"
                    onClick={handleSendVerification}
                  >
                    Send Verification Code
                  </Button>
                </FormControl>
              ) : (
                <Text>Email is verified. You may proceed to the next step.</Text>
              )}

              <Button
                mt={6}
                colorScheme="purple"
                onClick={handleNextStep}
                isDisabled={!isEmailVerified}
              >
                Next
              </Button>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Heading fontSize="lg" mb={4}>
                Submit your KYC Documents
              </Heading>
              <FormControl mb={4}>
                <FormLabel>ID Front</FormLabel>
                <Input
                  type="file"
                  onChange={(e) => setKycFront(e.target.files[0])}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>ID Back</FormLabel>
                <Input
                  type="file"
                  onChange={(e) => setKycBack(e.target.files[0])}
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
