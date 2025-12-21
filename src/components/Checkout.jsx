export default function Checkout({
  cart,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  notes,
  setNotes,
  onIncrease,
  onDecrease,
  onClose,
  onConfirm,
}) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <div className="checkout-overlay">
      <div className="checkout-panel">
        <div className="checkout-header">
          <h3>Riepilogo ordine</h3>
          <button className="checkout-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* PRODOTTI */}
        <div className="checkout-items">
          {cart.map(item => (
            <div key={item.id} className="checkout-item">
              <div className="checkout-item-info">
                <div className="checkout-item-name">{item.name}</div>
                <div className="checkout-item-price">
                  € {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>

              <div className="checkout-qty">
                <button onClick={() => onDecrease(item.id)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => onIncrease(item.id)}>+</button>
              </div>
            </div>
          ))}
        </div>

        {/* TOTALE */}
        <div className="checkout-total">
          <span>Totale</span>
          <strong>€ {total.toFixed(2)}</strong>
        </div>

        {/* DATI CLIENTE */}
        <div className="checkout-form">
          <input
            type="text"
            placeholder="Il tuo nome"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Numero WhatsApp"
            value={customerPhone}
            onChange={e => setCustomerPhone(e.target.value)}
          />

          <textarea
            placeholder="Note (facoltative)"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        {/* INVIA */}
        <button className="checkout-submit" onClick={onConfirm}>
          Invia ordine
        </button>

        <p className="checkout-note">
          Ti contatterò io per confermare ritiro o consegna.
        </p>
      </div>
    </div>
  )
}

/* =========================
   CHECKOUT OVERLAY
========================= */

.checkout-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 999;
}

/* =========================
   CHECKOUT PANEL
========================= */

.checkout-panel {
  width: 100%;
  max-width: 480px;
  background: #1a1a1a;
  border-radius: 20px 20px 0 0;
  padding: 20px;
  animation: slideUp 0.35s ease-out;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.5);
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

/* =========================
   HEADER
========================= */

.checkout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.checkout-header h3 {
  color: var(--gold);
  font-size: 18px;
  font-weight: 600;
}

.checkout-close {
  background: none;
  border: none;
  color: #aaa;
  font-size: 26px;
  cursor: pointer;
}

/* =========================
   ITEMS
========================= */

.checkout-items {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 16px;
}

.checkout-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkout-item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.checkout-item-name {
  font-size: 15px;
  color: #fff;
}

.checkout-item-price {
  font-size: 14px;
  color: var(--gold);
}

/* =========================
   QUANTITY
========================= */

.checkout-qty {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkout-qty button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--gold);
  background: transparent;
  color: var(--gold);
  font-size: 18px;
  cursor: pointer;
}

.checkout-qty span {
  min-width: 20px;
  text-align: center;
  color: #fff;
  font-size: 14px;
}

/* =========================
   TOTAL
========================= */

.checkout-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #2a2a2a;
  padding-top: 14px;
  margin-bottom: 16px;
}

.checkout-total span {
  color: #ccc;
  font-size: 14px;
}

.checkout-total strong {
  color: var(--gold);
  font-size: 18px;
}

/* =========================
   FORM
========================= */

.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.checkout-form input,
.checkout-form textarea {
  background: #0f0f0f;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  padding: 12px;
  color: #fff;
  font-size: 14px;
}

.checkout-form textarea {
  resize: none;
  min-height: 70px;
}

.checkout-form input::placeholder,
.checkout-form textarea::placeholder {
  color: #777;
}

/* =========================
   SUBMIT
========================= */

.checkout-submit {
  width: 100%;
  background: var(--gold);
  color: #000;
  border: none;
  border-radius: 14px;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.checkout-submit:active {
  transform: scale(0.98);
}

/* =========================
   NOTE
========================= */

.checkout-note {
  text-align: center;
  font-size: 12px;
  color: #888;
  margin-top: 10px;
}
