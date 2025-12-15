export default function Checkout({
  cart,
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
        {/* HEADER */}
        <div className="checkout-header">
          <h2>Riepilogo ordine</h2>
          <button onClick={onClose} className="checkout-close">
            ✕
          </button>
        </div>

        {/* LISTA */}
        <div className="checkout-list">
          {cart.map(item => (
            <div key={item.id} className="checkout-item">
              <div className="checkout-item-info">
                <span className="checkout-item-name">
                  {item.name}
                </span>
                <span className="checkout-item-price">
                  € {(item.price * item.quantity).toFixed(2)}
                </span>
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

        {/* AZIONE */}
        <button
          className="checkout-confirm"
          onClick={onConfirm}
        >
          Invia ordine
        </button>

        <p className="checkout-note">
          Ti contatterò io per confermare ritiro o consegna.
        </p>
      </div>
    </div>
  )
}