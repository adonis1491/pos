import { useState } from 'react';
import type { CartItem } from '../types/cart';
import type { Product } from '../types/product';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeInput, setActiveInput] = useState<'quantity' | 'price' | null>(null);
  const [inputValue, setInputValue] = useState('');

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleNumpadInput = (value: string) => {
    if (!activeInput) return;
    setInputValue(prev => {
      if (value === 'backspace') return prev.slice(0, -1);
      if (value === 'clear') return '';
      if (value === '.' && prev.includes('.')) return prev;
      return prev + value;
    });
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return {
    cart,
    setCart,
    activeInput,
    setActiveInput,
    inputValue,
    setInputValue,
    addToCart,
    handleNumpadInput,
    calculateTotal,
  };
}