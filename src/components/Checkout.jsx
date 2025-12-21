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
            x
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
                <button onClick={() => onDecrease(item.id)}>-</button>
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