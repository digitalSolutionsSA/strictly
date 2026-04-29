export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular?: boolean;
  tags?: string[];
  customizable?: boolean;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  notes?: string;
  customizations?: string[];
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  fulfillment: 'pickup' | 'delivery';
  address?: string;
  name: string;
  phone: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  createdAt: Date;
  estimatedTime?: number;
}

export type Category = {
  id: string;
  label: string;
  emoji: string;
};
