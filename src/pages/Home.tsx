import React, { useState, useMemo } from 'react';
import { Search, Star, Flame } from 'lucide-react';
import { menuItems, categories } from '../data/menu';
import { useCart } from '../context/CartContext';
import { MenuItem } from '../types';
import ItemModal from '../components/ItemModal';
import './Home.css';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const { dispatch } = useCart();

  const filtered = useMemo(() => {
    let items = menuItems;
    if (activeCategory !== 'all') {
      items = items.filter(i => i.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(i =>
        i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
      );
    }
    return items;
  }, [activeCategory, searchQuery]);

  const popular = useMemo(() => menuItems.filter(i => i.popular).slice(0, 6), []);

  const handleAdd = (item: MenuItem) => {
    dispatch({ type: 'ADD_ITEM', payload: { item } });
  };

  return (
    <div className="home-page">
      {/* Header */}
      <div className="home-header">
        <div className="header-top">
          <div>
            <div className="greeting">Good morning ☀️</div>
            <h1 className="header-title">What are you<br /><em>craving today?</em></h1>
          </div>
          <div className="logo-badge">
            <span className="logo-badge-text">SCC</span>
          </div>
        </div>

        {/* Search */}
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search coffee, food, pastries..."
            className="search-input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Popular - only show when not searching */}
      {!searchQuery && activeCategory === 'all' && (
        <div className="popular-section">
          <div className="section-header">
            <div className="section-header-left">
              <Flame size={16} className="flame-icon" />
              <span className="popular-label">Popular Picks</span>
            </div>
          </div>
          <div className="popular-scroll">
            {popular.map((item, i) => (
              <PopularCard key={item.id} item={item} onPress={() => setSelectedItem(item)} delay={i * 50} />
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="categories-scroll">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`cat-chip ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="menu-section">
        {!searchQuery && (
          <div className="menu-section-title">
            {activeCategory === 'all' ? 'Full Menu' : categories.find(c => c.id === activeCategory)?.label}
            <span className="menu-count">{filtered.length} items</span>
          </div>
        )}
        {searchQuery && (
          <div className="menu-section-title">
            Results for "{searchQuery}"
            <span className="menu-count">{filtered.length} found</span>
          </div>
        )}
        <div className="menu-list">
          {filtered.map((item, i) => (
            <MenuCard key={item.id} item={item} onPress={() => setSelectedItem(item)} onAdd={() => handleAdd(item)} delay={i * 30} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-emoji">☕</div>
            <div className="empty-title">Nothing here</div>
            <div className="empty-sub">Try searching something else</div>
          </div>
        )}
      </div>

      {/* Item Modal */}
      {selectedItem && (
        <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}

function PopularCard({ item, onPress, delay }: { item: MenuItem; onPress: () => void; delay: number }) {
  return (
    <button
      className="popular-card animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
      onClick={onPress}
    >
      <div className="popular-card-emoji">{item.image}</div>
      <div className="popular-card-name">{item.name}</div>
      <div className="popular-card-price">R{item.price}</div>
    </button>
  );
}

function MenuCard({ item, onPress, onAdd, delay }: { item: MenuItem; onPress: () => void; onAdd: () => void; delay: number }) {
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAdded(true);
    onAdd();
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div
      className="menu-card animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
      onClick={onPress}
    >
      <div className="menu-card-emoji">{item.image}</div>
      <div className="menu-card-body">
        <div className="menu-card-top">
          <div className="menu-card-name">{item.name}</div>
          {item.popular && (
            <span className="popular-badge"><Star size={9} fill="currentColor" /> Popular</span>
          )}
        </div>
        <div className="menu-card-desc">{item.description}</div>
        <div className="menu-card-footer">
          <div className="menu-card-tags">
            {item.tags?.slice(0, 2).map(t => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="menu-card-right">
        <div className="menu-card-price">R{item.price}</div>
        <button
          className={`add-btn ${added ? 'added' : ''}`}
          onClick={handleAdd}
        >
          {added ? '✓' : '+'}
        </button>
      </div>
    </div>
  );
}
