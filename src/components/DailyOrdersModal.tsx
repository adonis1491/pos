import React from 'react';
import { X } from 'lucide-react';
import type { OrderSummary } from '../types/financial';
import { formatCurrency, formatDate } from '../utils/formatters';

type DailyOrdersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderSummary[];
};

const DailyOrdersModal: React.FC<DailyOrdersModalProps> = ({
  isOpen,
  onClose,
  orders
}) => {
  if (!isOpen) return null;

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm z-50">
      <div className="bg-starbucks-brown p-6 rounded-xl shadow-xl max-w-4xl w-full border border-starbucks-green/20 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Daily Orders</h2>
            <p className="text-white/60">
              {orders.length} orders • Total: {formatCurrency(totalSales)}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {orders.map((order) => (
            <div 
              key={order.id}
              className="bg-white/5 rounded-lg p-4 mb-3 border border-white/10"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-white/90 font-medium">
                    Order #{order.id.slice(-6)}
                  </p>
                  <p className="text-sm text-white/60">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-starbucks-gold font-medium">
                    {formatCurrency(order.total)}
                  </p>
                  <p className="text-sm text-white/60">
                    {order.payment_type}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                {order.items.map((item, index) => (
                  <div 
                    key={index}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-white/80">
                      {item.quantity}x {item.product_name}
                    </span>
                    <span className="text-white/60">
                      {formatCurrency(item.total)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyOrdersModal;