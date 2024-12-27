import React, { useState } from 'react';
import { ShoppingCart, Search, Settings, Clock, Menu, Coffee, QrCode, Star } from 'lucide-react';
import Numpad from './components/Numpad';
import CartItems from './components/CartItems';
import ProductGrid from './components/ProductGrid';
import PaymentModal from './components/PaymentModal';
import DailyOrdersModal from './components/DailyOrdersModal';
import { useCart } from './hooks/useCart';
import { usePayment } from './hooks/usePayment';
import { getDailyOrders } from './lib/orders';
import type { OrderSummary } from './types/financial';

const App: React.FC = () => {
  const {
    cart,
    setCart,
    addToCart,
    handleNumpadInput,
    calculateTotal,
  } = useCart();

  const {
    showPaymentModal,
    selectedPaymentType,
    handlePayment,
    handlePaymentComplete,
  } = usePayment();

  const [showDailyOrders, setShowDailyOrders] = useState(false);
  const [dailyOrders, setDailyOrders] = useState<OrderSummary[]>([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(150);
  const [showScanner, setShowScanner] = useState(false);

  const handleViewDailyOrders = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const orders = await getDailyOrders(today);
      setDailyOrders(orders);
      setShowDailyOrders(true);
    } catch (error) {
      console.error('Error fetching daily orders:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-starbucks-brown-dark text-white">
      <header className="bg-starbucks-brown text-white p-3 flex items-center justify-between shrink-0 border-b border-starbucks-green/20">
        <div className="flex items-center space-x-3">
          <Coffee className="h-6 w-6 text-starbucks-green" />
          <span className="text-xl font-semibold">Starbucks POS</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-starbucks-green/10 px-3 py-1.5 rounded-lg">
            <Star className="h-4 w-4 text-starbucks-gold fill-current" />
            <span className="text-starbucks-gold font-medium">{loyaltyPoints} pts</span>
          </div>
          
          <button 
            onClick={() => setShowScanner(true)}
            className="flex items-center gap-2 bg-starbucks-green px-3 py-1.5 rounded-lg hover:bg-starbucks-green-light transition-colors"
          >
            <QrCode className="h-4 w-4" />
            <span className="text-sm font-medium">Scan Card</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button onClick={handleViewDailyOrders}>
              <Clock className="h-5 w-5 text-starbucks-green/80 hover:text-starbucks-green" />
            </button>
            <Settings className="h-5 w-5 text-starbucks-green/80" />
          </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 p-3 h-[calc(100vh-4rem)] overflow-hidden">
        <div className="md:col-span-7 bg-starbucks-brown/50 rounded-xl shadow-lg p-3 overflow-auto backdrop-blur-sm border border-starbucks-green/20">
          <ProductGrid onProductSelect={addToCart} />
        </div>

        <div className="md:col-span-5 flex flex-col gap-3 h-full">
          <div className="flex-1 bg-starbucks-brown/50 rounded-xl shadow-lg p-3 min-h-0 backdrop-blur-sm border border-starbucks-green/20">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-starbucks-green" />
                Current Order
              </h2>
              <span className="text-sm text-starbucks-green/80">Items: {cart.length}</span>
            </div>
            
            <CartItems cart={cart} setCart={setCart} />

            <div className="border-t border-starbucks-green/20 mt-3 pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-starbucks-gold">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-starbucks-brown/50 rounded-xl shadow-lg p-4 backdrop-blur-sm border border-starbucks-green/20">
            <Numpad onInput={handleNumpadInput} onPayment={handlePayment} />
          </div>
        </div>
      </main>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => handlePaymentComplete(cart, calculateTotal())}
        amount={calculateTotal()}
        paymentType={selectedPaymentType}
      />

      <DailyOrdersModal
        isOpen={showDailyOrders}
        onClose={() => setShowDailyOrders(false)}
        orders={dailyOrders}
      />

      {showScanner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm z-50">
          <div className="bg-starbucks-brown p-6 rounded-xl shadow-xl max-w-md w-full border border-starbucks-green/20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Scan Loyalty Card</h2>
              <button 
                onClick={() => setShowScanner(false)}
                className="text-white/60 hover:text-white"
              >
                <QrCode className="h-5 w-5" />
              </button>
            </div>
            <div className="aspect-square bg-white/10 rounded-lg flex items-center justify-center border-2 border-dashed border-starbucks-green/30">
              <div className="text-center text-white/60">
                <QrCode className="h-16 w-16 mx-auto mb-4 opacity-40" />
                <p>Place QR code in view</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;