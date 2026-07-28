'use client';

import { createContext, useContext, useMemo, useState } from 'react';

const CheckoutContext = createContext(null);

const initialAddress = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNo: '',
  streetAddress: '',
  city: '',
  state: '',
  zipcode: '',
  specialInstruction: '',
};

export function CheckoutProvider({ children }) {
  const [address, setAddress] = useState(initialAddress);
  const [shippingMethod, setShippingMethod] = useState('standard');

  const value = useMemo(
    () => ({
      address,
      setAddress,
      shippingMethod,
      setShippingMethod,
    }),
    [address, shippingMethod]
  );

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within CheckoutProvider');
  }
  return context;
}
