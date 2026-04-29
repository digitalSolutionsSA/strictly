import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Banknote, CheckCircle, Clock, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Checkout.css';

interface Props {
  onBack: () => void;
  onSuccess: () => void;
}

type PaymentMethod = 'card' | 'eft' | 'cash';

export default function Checkout({ onBack, onSuccess }: Props) {
  const { state, dispatch, grandTotal, deliveryFee } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!state.customerName.trim()) newErrors.name = 'Name is required';
    if (!state.customerPhone.trim()) newErrors.phone = 'Phone number is required';
    if (state.fulfillment === 'delivery' && !state.deliveryAddress.trim()) {
      newErrors.address = 'Delivery address is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    onSuccess();
  };

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="section-title">Checkout</h1>
        <div style={{ width: 40 }} />
      </div>

      {/* Your Details */}
      <div className="checkout-section">
        <div className="checkout-section-title">Your Details</div>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            className={`input-field ${errors.name ? 'error' : ''}`}
            placeholder="e.g. Jane Smith"
            value={state.customerName}
            onChange={e => dispatch({ type: 'SET_CUSTOMER_NAME', payload: e.target.value })}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input
            className={`input-field ${errors.phone ? 'error' : ''}`}
            placeholder="e.g. 079 255 5418"
            type="tel"
            value={state.customerPhone}
            onChange={e => dispatch({ type: 'SET_CUSTOMER_PHONE', payload: e.target.value })}
          />
          {errors.phone && <span className="field-error">{errors.phone}</span>}
        </div>
      </div>

      {/* Delivery Address (if delivery) */}
      {state.fulfillment === 'delivery' && (
        <div className="checkout-section animate-fade-in">
          <div className="checkout-section-title">Delivery Address</div>
          <div className="form-group">
            <label className="form-label">Street Address</label>
            <textarea
              className={`input-field ${errors.address ? 'error' : ''}`}
              placeholder="Street, suburb, city"
              value={state.deliveryAddress}
              onChange={e => dispatch({ type: 'SET_ADDRESS', payload: e.target.value })}
              rows={2}
              style={{ resize: 'none' }}
            />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>
        </div>
      )}

      {/* Fulfillment Summary */}
      <div className="fulfillment-summary">
        {state.fulfillment === 'pickup' ? (
          <div className="fulfillment-info">
            <MapPin size={16} className="fulfillment-icon" />
            <div>
              <div className="fulfillment-info-title">Pick Up</div>
              <div className="fulfillment-info-sub">Ready in ~15–20 minutes</div>
            </div>
            <div className="fulfillment-eta">
              <Clock size={13} />
              15 min
            </div>
          </div>
        ) : (
          <div className="fulfillment-info">
            <div style={{ fontSize: 22 }}>🚗</div>
            <div>
              <div className="fulfillment-info-title">Delivery</div>
              <div className="fulfillment-info-sub">Estimated 30–45 minutes · R{deliveryFee} fee</div>
            </div>
            <div className="fulfillment-eta">
              <Clock size={13} />
              35 min
            </div>
          </div>
        )}
      </div>

      {/* Payment */}
      <div className="checkout-section">
        <div className="checkout-section-title">Payment Method</div>
        <div className="payment-options">
          <button
            className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('card')}
          >
            <CreditCard size={22} />
            <div>
              <div className="payment-option-title">Card</div>
              <div className="payment-option-sub">Visa, Mastercard</div>
            </div>
          </button>
          <button
            className={`payment-option ${paymentMethod === 'eft' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('eft')}
          >
            <Smartphone size={22} />
            <div>
              <div className="payment-option-title">EFT / Snapscan</div>
              <div className="payment-option-sub">Instant transfer</div>
            </div>
          </button>
          <button
            className={`payment-option ${paymentMethod === 'cash' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('cash')}
          >
            <Banknote size={22} />
            <div>
              <div className="payment-option-title">Cash</div>
              <div className="payment-option-sub">Pay on collection</div>
            </div>
          </button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="checkout-section order-summary">
        <div className="checkout-section-title">Order Summary</div>
        {state.items.map(ci => (
          <div key={ci.item.id} className="summary-line">
            <span className="summary-line-qty">{ci.quantity}×</span>
            <span className="summary-line-name">{ci.item.name}</span>
            <span className="summary-line-price">R{ci.item.price * ci.quantity}</span>
          </div>
        ))}
        {deliveryFee > 0 && (
          <div className="summary-line">
            <span className="summary-line-qty"></span>
            <span className="summary-line-name" style={{ color: 'var(--text-light)' }}>Delivery fee</span>
            <span className="summary-line-price" style={{ color: 'var(--text-light)' }}>R{deliveryFee}</span>
          </div>
        )}
        <div className="divider" style={{ margin: '12px 0' }} />
        <div className="summary-line total-line">
          <span></span>
          <span>Total</span>
          <span>R{grandTotal}</span>
        </div>
      </div>

      {/* Place Order */}
      <div className="place-order-wrap">
        <button
          className={`btn-primary place-order-btn ${isProcessing ? 'processing' : ''}`}
          onClick={handlePlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="spinner" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle size={18} />
              Place Order · R{grandTotal}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
