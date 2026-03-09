// models/menu-item.model.ts
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  image: string;
  ingredients: string[];
  isRecommended: boolean;
  isDiscounted: boolean;
  discountPercent: number;
  rating: number;
  prepTime: number;
  isVegetarian: boolean;
  isSpicy: boolean;
  calories: number;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  CASH = 'CASH',
  DIGITAL_WALLET = 'DIGITAL_WALLET'
}

export interface Order {
  id: string;
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: Date;
  estimatedDelivery?: Date;
  specialNotes?: string;
}

export interface MenuData {
  categories: Category[];
  menuItems: MenuItem[];
}

export class MenuItemModel implements MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  image: string;
  ingredients: string[];
  isRecommended: boolean;
  isDiscounted: boolean;
  discountPercent: number;
  rating: number;
  prepTime: number;
  isVegetarian: boolean;
  isSpicy: boolean;
  calories: number;

  constructor(data: MenuItem) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.categoryId = data.categoryId;
    this.image = data.image;
    this.ingredients = data.ingredients;
    this.isRecommended = data.isRecommended;
    this.isDiscounted = data.isDiscounted;
    this.discountPercent = data.discountPercent;
    this.rating = data.rating;
    this.prepTime = data.prepTime;
    this.isVegetarian = data.isVegetarian;
    this.isSpicy = data.isSpicy;
    this.calories = data.calories;
  }

  get effectivePrice(): number {
    if (this.isDiscounted && this.discountPercent > 0) {
      return this.price * (1 - this.discountPercent / 100);
    }
    return this.price;
  }
}
