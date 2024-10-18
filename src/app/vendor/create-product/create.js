'use client';

import { useState } from 'react';
import {
  Progress,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  GridItem,
  FormLabel,
  Input,
  SimpleGrid,
  Textarea,
  useToast,
  Select
} from '@chakra-ui/react';
import { useEdgeStore } from '@/app/edgeProvider';
import { SingleImageDropzone } from '@/components/singleImage';
import { MultiImageDropzone } from '@/components/multiImage';
import Bottom from '@/components/BottomNav';

// Define initial form data
const initialFormData = {
  title: '',
  description: '',
  price: '',
  mainPhoto: '',
  category: '',
  photos: [],
};


const popularCategories = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Fashion' },
  { id: 3, name: 'Home & Garden' },
  { id: 4, name: 'Beauty & Health' },
  { id: 5, name: 'Sports & Outdoors' },
  { id: 6, name: 'Automotive' },
  { id: 7, name: 'Toys & Games' },
  { id: 8, name: 'Books' },
  { id: 9, name: 'Music' },
  { id: 10, name: 'Mobile & Gadgets' },
];
const Form1 = ({ formData, handleChange }) => {
  return (
    <>
      <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
        Product Information
      </Heading>
      <FormControl mb="2%">
        <FormLabel htmlFor="title" fontWeight={'normal'}>
          Title
        </FormLabel>
        <Input
          id="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl mb="2%">
        <FormLabel htmlFor="description" fontWeight={'normal'}>
          Description
        </FormLabel>
        <Textarea
          id="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl mb="2%">
        <FormLabel htmlFor="price" fontWeight={'normal'}>
          Price
        </FormLabel>
        <Input
          id="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
        />
      </FormControl>
    </>
  );
};

const Form2 = ({ formData, handleChange }) => {
  return <></>;
};

const Form3 = ({ formData, handleChange }) => {
  return <></>;
};

export default function Create() {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(33.33);
  const [formData, setFormData] = useState(initialFormData);
  const [file, setFile] = useState();
  const [fileStates, setFileStates] = useState([]);
  const { edgestore } = useEdgeStore();
const [loading, isLoading] = useState(false) 
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };


  function updateFileProgress(key, progress) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key,
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  const handleSubmit = async () => {
    isLoading(true)
    try {
      // Upload main photo
      const mainPhotoRes = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          // you can use this to show a progress bar
          console.log(progress);
        },
      });

      // Upload additional photos
      const uploadedPhotos = await Promise.all(
        fileStates.map(async (fileState) => {
          const res = await edgestore.publicFiles.upload({
            file: fileState.file,
            onProgressChange: async (progress) => {
              updateFileProgress(fileState.key, progress);
              if (progress === 100) {
                // wait 1 second to set it to complete
                // so that the user can see the progress bar at 100%
                await new Promise((resolve) => setTimeout(resolve, 1000));
                updateFileProgress(fileState.key, 'COMPLETE');
              }
            },
          });
          return res.url;
        })
      );

      // Submit the form
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          mainPhoto: mainPhotoRes.url,
          price: parseFloat(formData.price),
          photos: uploadedPhotos,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      toast({
        position:'top-right',
        title: 'Product created.',
        description: "We've created your product.",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setFormData(initialFormData); // Reset form data after successful submission
      setFile(null);
      setFileStates([]);
      isLoading(false)
    } catch (error) {
      toast({
        position:'top-right',
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box

mt={'300px'}
        rounded="lg"
        maxWidth={800}
        p={6}
        m="10px auto"
        as="form">
          <Box
        w={'full'}
        h={'50px'}
        >

        </Box>
        <Progress
        mt={'10px'}
        borderRadius={'10px'}
          colorScheme={'orange'}
          hasStripe
          value={progress}
          mb="5%"
          mx="5%"
          isAnimated
        ></Progress>
        {step === 1 ? (
          <Form1 formData={formData} handleChange={handleChange} />
        ) : step === 2 ? (
          <>
            <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
              Product Details
            </Heading>
            <FormControl
              mb="2%"
              h={'auto'}
              justifyContent={'center'}
              alignItems={'center'}
              display={'flex'}
              flexDirection={'column'}>
              <FormLabel htmlFor="mainPhoto" fontWeight={'normal'}>
                Main Photo URL
              </FormLabel>
              <SingleImageDropzone
                width={200}
                height={200}
                value={file}
                onChange={(file) => {
                  setFile(file);
                }}
              />
            </FormControl>
            <FormControl mb="2%">
              <FormLabel htmlFor="category" fontWeight={'normal'}>
                Category
              </FormLabel>
              <Select
      id="category"
      placeholder="Select a category"
      value={formData.category}
      onChange={handleChange}
    >
      {popularCategories.map(category => (
        <option key={category.id} value={category.name}>
          {category.name}
        </option>
      ))}
    </Select>
            </FormControl>
          </>
        ) : (
          <>
            <Heading w="100%" textAlign={'center'} fontWeight="normal">
              Additional Photos
            </Heading>
            <SimpleGrid columns={1} spacing={6}>
              <FormControl mb="2%">
                <FormLabel htmlFor="photos" fontWeight={'normal'}>
                  Photos
                </FormLabel>
                <MultiImageDropzone
                  value={fileStates}
                  dropzoneOptions={{
                    maxFiles: 3,
                  }}
                  onChange={(files) => {
                    setFileStates(files);
                  }}
                />
              </FormControl>
            </SimpleGrid>
          </>
        )}
        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={() => {
                  setStep(step - 1);
                  setProgress(progress - 33.33);
                }}
                isDisabled={step === 1}
                colorScheme={'orange'}
                w="7rem"
                mr="5%">
                Back
              </Button>
              <Button
                w="7rem"
                isDisabled={step === 3}
                onClick={() => {
                  setStep(step + 1);
                  setProgress(progress + 33.33);
                }}
                colorScheme={'orange'}
                variant="outline">
                Next
              </Button>
            </Flex>
            {step === 3 ? (
              <Button
              isLoading={loading}
                w="7rem"
                colorScheme={'orange'}
                variant="solid"
                onClick={handleSubmit}>
                Submit
              </Button>
            ) : null}
          </Flex>
        </ButtonGroup>
        <Bottom/>
      </Box>
    </>
  );
}
