import React from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { Button, useToast } from '@chakra-ui/react';
import { useRouter } from "next/navigation";

export default function FWBTN(props) {
    const toast = useToast();
    const router = useRouter();
  const config = {
    public_key: process.env.FWKEY,
    tx_ref: Date.now(),
    amount: props.amount,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: props.email,
       phone_number: props.phone_number,
      name: props.name,
    },
    customizations: {
      title: 'Trade Place',
      description: 'Topup Treade Points',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  return (

   

    <Button
  w={'full'} bg={'orange'} mt={'10px'} color={'#fff'}
  onClick={() => {
    handleFlutterPayment({
      callback: async (response) => {
        if (response.status === 'completed' && response.charge_response_message === 'Approved Successful') {
          // Make a POST request to the payment success API route
          try {
            const res = await fetch('/api/paymentSuccess/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                amount: response.amount,  // Replace with the actual amount from the response
                points: response.charged_amount / 100,  // Replace with the actual points logic
                currency: response.currency || 'NGN',  // Replace with actual currency
                paymentMethod: 'Flutterwave',
                transactionId: response.transaction_id,  // Use the correct transaction ID field
              }),
            });

            if (res.ok) {
              const data = await res.json();
              
              toast({
                title: 'Topup successful!',
                status: 'success',
                position: 'top-right',
                duration: 9000,
                isClosable: true,
              })
              console.log('Payment success and points updated:', data);
            } else {
              console.error('Failed to update points or add transaction:', res.status);
            }
          } catch (error) {
            console.error('Error during the API request:', error);
          }
        }
   
router.push('/')

      },
      onClose: () => {},
    });
  }}
>
  Pay
</Button>

  );
}