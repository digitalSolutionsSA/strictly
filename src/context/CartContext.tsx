import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, MenuItem } from '../types';

interface CartState {
  items: CartItem[];
  fulfillment: 'pickup' | 'delivery';
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { item: MenuItem; notes?: string; customizations?: string[] } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'SET_FULFILLMENT'; payload: 'pickup' | 'delivery' }
  | { type: 'SET_ADDRESS'; payload: string }
  | { type: 'SET_CUSTOMER_NAME'; payload: string }
  | { type: 'SET_CUSTOMER_PHONE'; payload: string }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  fulfillment: 'pickup',
  deliveryAddress: '',
  customerName: '',
  customerPhone: '',
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.item.id === action.payload.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.item.id === action.payload.item.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { item: action.payload.item, quantity: 1, notes: action.payload.notes, customizations: action.payload.customizations }],
      };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.item.id !== action.payload) };
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.item.id !== action.payload.id) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.item.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    case 'SET_FULFILLMENT':
      return { ...state, fulfillment: action.payload };
    case 'SET_ADDRESS':
      return { ...state, deliveryAddress: action.payload };
    case 'SET_CUSTOMER_NAME':
      return { ...state, customerName: action.payload };
    case 'SET_CUSTOMER_PHONE':
      return { ...state, customerPhone: action.payload };
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  total: number;
  itemCount: number;
  deliveryFee: number;
  grandTotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const total = state.items.reduce((sum, i) => sum + i.item.price * i.quantity, 0);
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const deliveryFee = state.fulfillment === 'delivery' ? 35 : 0;
  const grandTotal = total + deliveryFee;

  return (
    <CartContext.Provider value={{ state, dispatch, total, itemCount, deliveryFee, grandTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
