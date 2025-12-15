import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Checkout({ cart, setCart, onClose, onClear }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const total = cart.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  )

  const updateQty = (id, delta) => {
    setCart(prev =>
      prev
        .map(item =>
          item.id === id
            ? { ...item, qty: item.qty + delta }
            : item
        )
        .filter(item => item.qty > 0)
    )
  }

  const submitOrder = async () => {
    if (!name || !phone) {
      alert('Inserisci nome e telefono')
      return
    }

    setLoading(true)

    try {
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          customer_name: name,
          customer_phone: phone,
          note,
          total,
          status: 'nuovo'
        })
        .select()
        .single()

      if (error) throw error

      const items = cart.map(i => ({
        order_id: order.id,
        product_id: i.id,
        quantity: i.qty,
        price: i.price
      }))

      await supabase.from('order_items').insert(items)

      setSuccess(true)
      onClear()
    } catch (err) {
      alert('Errore nell’invio dell’ordine')
      console.error(err)
    }

    setLoading(false)
  }

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div
        className="checkout-sheet"
        onClick={e => e.stopPropagation()}
      >
        <div className="sheet-handle" />

        {success ? (
          <>
            <h2>Ordine ricevuto 💛</h2>
            <p className="checkout-info">
              Grazie! Abbiamo ricevuto il tuo ordine.
              <br />
              Ti contatteremo a breve su WhatsApp
              per confermare ritiro o consegna.
            </p>

            <button
              className="checkout-submit"
              onClick={onClose}
            >
              Torna alla home
            </button>
          </>
        ) : (
          <>
            <h2>Riepilogo ordine</h2>

            <div className="checkout-summary">
              {cart.map(item => (
                <div key={item.id} className="checkout-row">
                  <span>{item.name}</span>

                  <div className="checkout-qty">
                    <button onClick={() => updateQty(item.id, -1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)}>+</button>
                  </div>

                  <span className="checkout-price">
                    € {(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="checkout-total">
              Totale: € {total.toFixed(2)}
            </div>

            <div className="checkout-form">
              <input
                placeholder="Il tuo nome"
                value={name}
                onChange={e => setName(e.target.value)}
              />

              <input
                placeholder="Telefono"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />

              <textarea
                placeholder="Note (opzionale)"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>

            <p className="checkout-info">
              Nessun pagamento online.
              Riceverai conferma su WhatsApp.
            </p>

            <button
              className="checkout-submit"
              onClick={submitOrder}
              disabled={loading}
            >
              {loading ? 'Invio…' : 'Invia ordine'}
            </button>

            <button className="checkout-cancel" onClick={onClose}>
              Annulla
            </button>
          </>
        )}
      </div>
    </div>
  )
}