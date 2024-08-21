import React from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { Button } from '@chakra-ui/react';

export default function FWBTN(props) {
  const config = {
    public_key: 'FLWPUBK_TEST-10e9a65064ee75f8b146a82f701d36ff-X',
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
            callback: (response) => {
               console.log(response);
                closePaymentModal() // this will close the modal programmatically
            },
            onClose: () => {},
          });
        }}
      >
        Pay
      </Button>

  );
}