import React, { useState } from 'react';
import { ShoppingBag, Truck, MapPin, Plus, Minus, Trash2, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

interface Props {
  onCheckout: () => void;
}

export default function Cart({ onCheckout }: Props) {
  const { state, dispatch, total, itemCount, deliveryFee, grandTotal } = useCart();

  if (itemCount === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-bag">
          <ShoppingBag size={56} strokeWidth={1.2} />
        </div>
        <h2 className="empty-title">Your bag is empty</h2>
        <p className="empty-sub">Add some delicious items<br />from our menu</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="section-title">Your Order</h1>
        <span className="cart-item-count">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
      </div>

      {/* Fulfillment Toggle */}
      <div className="fulfillment-section">
        <div className="fulfillment-toggle">
          <button
            className={`fulfillment-opt ${state.fulfillment === 'pickup' ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_FULFILLMENT', payload: 'pickup' })}
          >
            <MapPin size={16} />
            Pick Up
          </button>
          <button
            className={`fulfillment-opt ${state.fulfillment === 'delivery' ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_FULFILLMENT', payload: 'delivery' })}
          >
            <Truck size={16} />
            Delivery
          </button>
        </div>
        {state.fulfillment === 'delivery' && (
          <div className="delivery-note animate-fade-in">
            <Truck size={13} />
            Delivery fee: R{deliveryFee}
          </div>
        )}
        {state.fulfillment === 'pickup' && (
          <div className="pickup-note animate-fade-in">
            <MapPin size={13} />
            Collect from Strictly Come Coffee café
          </div>
        )}
      </div>

      {/* Cart Items */}
      <div className="cart-items">
        {state.items.map(ci => (
          <div key={ci.item.id} className="cart-item animate-slide-up">
            <div className="cart-item-emoji">{ci.item.image}</div>
            <div className="cart-item-body">
              <div className="cart-item-name">{ci.item.name}</div>
              {ci.customizations && ci.customizations.length > 0 && (
                <div className="cart-item-customs">
                  {ci.customizations.join(' · ')}
                </div>
              )}
              {ci.notes && (
                <div className="cart-item-notes">"{ci.notes}"</div>
              )}
              <div className="cart-item-footer">
                <span className="cart-item-price">R{ci.item.price * ci.quantity}</span>
                <div className="cart-item-controls">
                  <button
                    className="cart-qty-btn"
                    onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: ci.item.id, quantity: ci.quantity - 1 } })}
                  >
                    {ci.quantity === 1 ? <Trash2 size={13} /> : <Minus size={13} />}
                  </button>
                  <span className="cart-qty-val">{ci.quantity}</span>
                  <button
                    className="cart-qty-btn"
                    onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: ci.item.id, quantity: ci.quantity + 1 } })}
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>R{total}</span>
        </div>
        {state.fulfillment === 'delivery' && (
          <div className="summary-row">
            <span>Delivery fee</span>
            <span>R{deliveryFee}</span>
          </div>
        )}
        <div className="divider" style={{ margin: '12px 0' }} />
        <div className="summary-row total">
          <span>Total</span>
          <span>R{grandTotal}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="cart-checkout">
        <button className="btn-primary checkout-btn" onClick={onCheckout}>
          Proceed to Checkout
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
