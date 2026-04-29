import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';
import './ItemModal.css';

interface Props {
  item: MenuItem;
  onClose: () => void;
}

const milkOptions = ['Full Cream', 'Oat Milk', 'Almond Milk', 'Soy Milk', 'Lactose Free'];
const sizeOptions = ['Small', 'Medium', 'Large'];
const extraOptions = ['Extra Shot', 'Extra Sweet', 'Less Sugar', 'No Sugar', 'Extra Foam', 'Decaf'];

export default function ItemModal({ item, onClose }: Props) {
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [selectedMilk, setSelectedMilk] = useState('Full Cream');
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const toggleExtra = (extra: string) => {
    setSelectedExtras(prev =>
      prev.includes(extra) ? prev.filter(e => e !== extra) : [...prev, extra]
    );
  };

  const handleAdd = () => {
    const customizations = item.customizable
      ? [`${selectedSize}`, selectedMilk, ...selectedExtras].filter(Boolean)
      : [];
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: 'ADD_ITEM', payload: { item, notes, customizations } });
    }
    onClose();
  };

  const total = item.price * quantity;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet item-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />

        <div className="item-modal-header">
          <div className="item-modal-emoji">{item.image}</div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="item-modal-body">
          <div className="item-modal-title-row">
            <div>
              <h2 className="item-modal-title">{item.name}</h2>
              <p className="item-modal-desc">{item.description}</p>
            </div>
            <div className="item-modal-price">R{item.price}</div>
          </div>

          {item.tags && item.tags.length > 0 && (
            <div className="item-tags-row">
              {item.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          )}

          {item.customizable && (
            <>
              {/* Size */}
              <div className="option-section">
                <div className="option-label">Size</div>
                <div className="option-pills">
                  {sizeOptions.map(size => (
                    <button
                      key={size}
                      className={`option-pill ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Milk */}
              {item.category === 'coffee' || item.category === 'cold' ? (
                <div className="option-section">
                  <div className="option-label">Milk</div>
                  <div className="option-pills">
                    {milkOptions.map(milk => (
                      <button
                        key={milk}
                        className={`option-pill ${selectedMilk === milk ? 'active' : ''}`}
                        onClick={() => setSelectedMilk(milk)}
                      >
                        {milk}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Extras */}
              {(item.category === 'coffee' || item.category === 'cold') && (
                <div className="option-section">
                  <div className="option-label">Extras</div>
                  <div className="option-pills">
                    {extraOptions.map(extra => (
                      <button
                        key={extra}
                        className={`option-pill ${selectedExtras.includes(extra) ? 'active' : ''}`}
                        onClick={() => toggleExtra(extra)}
                      >
                        {extra}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Notes */}
          <div className="option-section">
            <div className="option-label">Special Instructions</div>
            <textarea
              className="notes-input"
              placeholder="Any special requests? (allergies, preferences...)"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <div className="item-modal-footer">
          <div className="qty-row">
            <span className="qty-label">Quantity</span>
            <div className="qty-stepper">
              <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                <Minus size={16} />
              </button>
              <span className="qty-value">{quantity}</span>
              <button className="qty-btn" onClick={() => setQuantity(q => q + 1)}>
                <Plus size={16} />
              </button>
            </div>
          </div>
          <button className="btn-primary add-to-cart-btn" onClick={handleAdd}>
            Add to Order · R{total}
          </button>
        </div>
      </div>
    </div>
  );
}
