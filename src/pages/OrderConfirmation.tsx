import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, MapPin, Truck, Phone, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './OrderConfirmation.css';

interface Props {
  onNewOrder: () => void;
}

const ORDER_STAGES = [
  { label: 'Order Received', icon: '✅', done: true },
  { label: 'Preparing', icon: '👨‍🍳', done: false },
  { label: 'Ready', icon: '☕', done: false },
];

export default function OrderConfirmation({ onNewOrder }: Props) {
  const { state, dispatch } = useCart();
  const orderNumber = `SCC-${Math.floor(Math.random() * 9000) + 1000}`;
  const [activeStage, setActiveStage] = useState(0);
  const isDelivery = state.fulfillment === 'delivery';
  const etaMin = isDelivery ? 35 : 15;
  const etaMax = isDelivery ? 45 : 20;

  useEffect(() => {
    const timer1 = setTimeout(() => setActiveStage(1), 3000);
    return () => clearTimeout(timer1);
  }, []);

  const handleNewOrder = () => {
    dispatch({ type: 'CLEAR_CART' });
    onNewOrder();
  };

  return (
    <div className="confirmation-page">
      <div className="confirmation-hero">
        <div className="success-ring">
          <CheckCircle size={52} strokeWidth={1.5} />
        </div>
        <div className="order-number">Order #{orderNumber}</div>
        <h1 className="confirmation-title">Order Placed!</h1>
        <p className="confirmation-sub">
          {isDelivery
            ? `We'll deliver to you in ${etaMin}–${etaMax} min`
            : `Ready to collect in ${etaMin}–${etaMax} min`}
        </p>
      </div>

      {/* ETA Card */}
      <div className="eta-card">
        <div className="eta-icon">{isDelivery ? <Truck size={20} /> : <MapPin size={20} />}</div>
        <div className="eta-info">
          <div className="eta-label">{isDelivery ? 'Estimated Delivery' : 'Ready for Pick Up'}</div>
          <div className="eta-time">~{etaMin}–{etaMax} minutes</div>
        </div>
        <div className="eta-clock">
          <Clock size={16} />
          <span>{etaMin} min</span>
        </div>
      </div>

      {/* Progress */}
      <div className="progress-section">
        <div className="progress-title">Order Status</div>
        <div className="progress-steps">
          {ORDER_STAGES.map((stage, i) => (
            <div key={stage.label} className={`progress-step ${i <= activeStage ? 'active' : ''}`}>
              <div className="step-icon-wrap">
                <div className="step-icon">{stage.icon}</div>
                {i < ORDER_STAGES.length - 1 && (
                  <div className={`step-line ${i < activeStage ? 'done' : ''}`} />
                )}
              </div>
              <div className="step-label">{stage.label}</div>
              {i === activeStage && (
                <div className="step-pulse" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Order Items */}
      <div className="confirmation-items">
        <div className="confirmation-section-title">Your Order</div>
        {state.items.map(ci => (
          <div key={ci.item.id} className="confirmation-item">
            <span className="ci-emoji">{ci.item.image}</span>
            <span className="ci-name">{ci.quantity}× {ci.item.name}</span>
            <span className="ci-price">R{ci.item.price * ci.quantity}</span>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="contact-section">
        <div className="confirmation-section-title">Need Help?</div>
        <div className="contact-options">
          <a href="tel:0792555418" className="contact-btn">
            <Phone size={18} />
            Call Us
          </a>
          <a href="https://wa.me/0792555418" className="contact-btn whatsapp">
            <MessageCircle size={18} />
            WhatsApp
          </a>
        </div>
      </div>

      <button className="btn-primary new-order-btn" onClick={handleNewOrder}>
        Place Another Order
      </button>
    </div>
  );
}
