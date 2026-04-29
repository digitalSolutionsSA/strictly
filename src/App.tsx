import React, { useState } from 'react';
import { ShoppingBag, UtensilsCrossed, User } from 'lucide-react';
import { CartProvider, useCart } from './context/CartContext';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Profile from './pages/Profile';
import './styles/global.css';

type Page = 'menu' | 'cart' | 'checkout' | 'confirmation' | 'profile';

function AppInner() {
  const [page, setPage] = useState<Page>('menu');
  const { itemCount } = useCart();

  const navigate = (p: Page) => setPage(p);

  const renderPage = () => {
    switch (page) {
      case 'menu':
        return <Home />;
      case 'cart':
        return <Cart onCheckout={() => navigate('checkout')} />;
      case 'checkout':
        return <Checkout onBack={() => navigate('cart')} onSuccess={() => navigate('confirmation')} />;
      case 'confirmation':
        return <OrderConfirmation onNewOrder={() => navigate('menu')} />;
      case 'profile':
        return <Profile />;
    }
  };

  const showNav = page !== 'checkout' && page !== 'confirmation';

  return (
    <div className="app-shell">
      <div className="page-scroll">
        {renderPage()}
      </div>

      {showNav && (
        <nav className="bottom-nav">
          <button
            className={`nav-item ${page === 'menu' ? 'active' : ''}`}
            onClick={() => navigate('menu')}
          >
            <div className="nav-icon">
              <UtensilsCrossed size={22} />
            </div>
            Menu
          </button>
          <button
            className={`nav-item ${page === 'cart' ? 'active' : ''}`}
            onClick={() => navigate('cart')}
          >
            <div className="nav-icon" style={{ position: 'relative' }}>
              <ShoppingBag size={22} />
              {itemCount > 0 && (
                <span className="nav-badge">{itemCount > 9 ? '9+' : itemCount}</span>
              )}
            </div>
            Order
          </button>
          <button
            className={`nav-item ${page === 'profile' ? 'active' : ''}`}
            onClick={() => navigate('profile')}
          >
            <div className="nav-icon">
              <User size={22} />
            </div>
            About
          </button>
        </nav>
      )}
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppInner />
    </CartProvider>
  );
}
