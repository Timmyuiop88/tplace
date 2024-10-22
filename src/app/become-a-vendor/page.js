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
  Input,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepSeparator,
  StepTitle,
  HStack,
  Skeleton
} from "@chakra-ui/react";
import { BsCashCoin } from "react-icons/bs";
import { useSteps } from "@chakra-ui/react";
import useUser from "../hooks/useUser"; // Adjust import path as needed
import { SingleImageDropzone } from "@/components/singleImage";
import { useEdgeStore } from "@/app/edgeProvider";
import { PinInput, PinInputField } from "@chakra-ui/react";

const steps = [
  { title: "Email Verification", description: "Verify your email address" },
  { title: "KYC", description: "Submit your KYC documents" },
];

export default function Become() {
  const [isVerifying, setIsVerifying] = useState(false);
  const {
    user,
    isEmailVerified,
    sendVerificationCodeMutation,
    confirmVerificationCodeMutation,
    isConfirming,
    isLoading
  } = useUser(setIsVerifying);
  const router = useRouter();


  const { edgestore } = useEdgeStore(); // Access edge store
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState(user?.email);
  const [verificationCode, setVerificationCode] = useState("");
  const [kycFront, setKycFront] = useState(null);
  const [kycBack, setKycBack] = useState(null);
  const toast = useToast();
  const [timer, setTimer] = useState(0);
  const [isLoadings, setIsLoadings] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  // useEffect to detect changes in isEmailVerified
  useEffect(() => {
    if (isEmailVerified) {
      setActiveStep(1); // Move to the next step automatically when email is verified
    }
  }, [isEmailVerified]);

  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleSendVerification = (email) => {
    setIsVerifying(true);
    if (email) {
      sendVerificationCodeMutation(email, {
        onSuccess: () => {
          setTimer(60);
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
    if (kycFront && kycBack) {
      setIsLoadings(true);
      try {
        const frontUploadRes = await edgestore.publicFiles.upload({
          file: kycFront,
        });

        const backUploadRes = await edgestore.publicFiles.upload({
          file: kycBack,
        });

        if (!frontUploadRes.url || !backUploadRes.url) {
          throw new Error("Failed to upload one or both KYC documents");
        }

        const response = await fetch("/api/kyc", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.id,
            idFrontUrl: frontUploadRes.url,
            idBackUrl: backUploadRes.url,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to submit KYC documents");
        }
router.push('/')
        toast({
          title: "KYC Submitted",
          description: "Your KYC documents have been submitted.",
          status: "success",
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
      } finally {
        setIsLoadings(false);
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

        <Box h={"auto"} pt={6}>
          {activeStep === 0 && (
            <Box>
              {isLoading ? (
                <Skeleton borderRadius={"15px"} w="full" height="250px" />
              ) : !isEmailVerified ? (
                <>
                  <FormControl>
                    <FormLabel>Email Verification</FormLabel>
                    <Box pb="10px" w="full" textAlign="center">
                      <Text fontSize="sm" color="gray.500">
                        Verification has been sent to your registered email: {user?.email}.
                      </Text>
                    </Box>
                    <HStack display="flex" justifyContent="center" w="full" pb="10px">
                      <PinInput
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e)}
                        otp
                      >
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                      </PinInput>
                    </HStack>
                  </FormControl>
                  <Box pt="10px" w="full" display="flex" flexDirection="column" gap="10px">
                    <Button
                      isLoading={isVerifying}
                      w="full"
                      colorScheme="orange"
                      variant={"outline"}
                      onClick={() => handleSendVerification(user?.email)}
                      isDisabled={timer > 0}
                    >
                      {timer > 0 ? `Resend in ${timer}s` : "Send Verification Code"}
                    </Button>
                    <Button
                      isLoading={isConfirming}
                      w="full"
                      colorScheme="orange"
                      onClick={handleVerifyCode}
                    >
                      Verify Code
                    </Button>
                  </Box>
                </>
              ) : (
                <Text textAlign={"center"}>Email is verified. You may proceed to the next step.</Text>
              )}
              <Box display={"flex"} w={"full"} justifyContent={"flex-end"}>
                <Button
                  size={"sm"}
                  mt={6}
                  colorScheme="purple"
                  onClick={handleNextStep}
                  isDisabled={!isEmailVerified}
                >
                  Next
                </Button>
              </Box>
            </Box>
          )}

          {activeStep === 1 && (
            <Box h={"auto"} pb={"100px"}>
              <Heading fontSize="xl" mb={4} textAlign={"center"}>
                Submit your KYC Documents
              </Heading>
              <FormControl
                mb={4}
                display={"flex"}
                flexDirection={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <FormLabel>ID Front</FormLabel>
                <SingleImageDropzone
                  width={"60vw"}
                  height={200}
                  value={kycFront}
                  onChange={(file) => setKycFront(file)}
                />
              </FormControl>

              <FormControl
                mb={4}
                display={"flex"}
                flexDirection={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <FormLabel>ID Back</FormLabel>
                <SingleImageDropzone
                  width={"60vw"}
                  height={200}
                  value={kycBack}
                  onChange={(file) => setKycBack(file)}
                />
              </FormControl>

              <Button
                w={"full"}
                isLoading={isLoadings}
                onClick={handleKycSubmit}
                colorScheme={"orange"}
                mt={6}
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
