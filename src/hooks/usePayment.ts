import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { CartItem } from '../types/cart';

export function usePayment() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState('');

  const handlePayment = (paymentType: string) => {
    setSelectedPaymentType(paymentType);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = async (cart: CartItem[], total: number) => {
    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          total,
          payment_type: selectedPaymentType,
          visitor_id: crypto.randomUUID(), // Default to visitor if no loyalty card
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setShowPaymentModal(false);
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  return {
    showPaymentModal,
    setShowPaymentModal,
    selectedPaymentType,
    setSelectedPaymentType,
    handlePayment,
    handlePaymentComplete,
  };
}