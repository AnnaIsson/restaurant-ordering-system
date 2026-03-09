// ============================================================
// Customer Model - Customer and Order data structures
// ============================================================

export interface Customer {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
  method: 'credit-card' | 'debit-card' | 'cash' | 'upi';
  cardNumber?: string;
  cardHolderName?: string;
  expiryDate?: string;
  cvv?: string;
  upiId?: string;
}

export interface Order {
  id?: string;
  customer: Customer;
  items: OrderItem[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  paymentInfo: PaymentInfo;
  status: OrderStatus;
  orderDate: Date;
  estimatedDelivery?: Date;
  specialInstructions?: string;
  deliveryType: 'delivery' | 'pickup' | 'dine-in';
}

export interface OrderItem {
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  price: number;
  subtotal: number;
  specialInstructions?: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled';
