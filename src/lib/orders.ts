import { supabase } from './supabase';
import type { OrderSummary } from '../types/financial';

export async function getDailyOrders(date: string): Promise<OrderSummary[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      total,
      payment_type,
      customer_id,
      visitor_id,
      created_at,
      order_items (
        product_id,
        quantity,
        price,
        total
      ),
      products (
        name
      )
    `)
    .gte('created_at', startOfDay.toISOString())
    .lte('created_at', endOfDay.toISOString())
    .order('created_at', { ascending: false });

  if (error) throw error;

  return orders.map(order => ({
    id: order.id,
    total: order.total,
    payment_type: order.payment_type,
    customer_id: order.customer_id,
    visitor_id: order.visitor_id,
    created_at: order.created_at,
    items: order.order_items.map(item => ({
      product_name: order.products.find(p => p.id === item.product_id)?.name || 'Unknown Product',
      quantity: item.quantity,
      price: item.price,
      total: item.total
    }))
  }));
}