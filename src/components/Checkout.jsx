import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Checkout({ cart, onClose, onClear }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

  const submitOrder = async () => {
    if (!name || !phone) return alert('Inserisci nome e telefono')

    setLoading(true)

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        customer_name: name,
        customer_phone: phone,
        note,
        total
      })
      .select()
      .single()

    if (!error) {
      const items = cart.map(i => ({
        order_id: order.id,
        product_id: i.id,
        qty: i.qty,
        price: i.price
      }))

      await supabase.from('order_items').insert(items)

      onClear()
      onClose()
      alert('Ordine ricevuto! Ti contatteremo a breve.')
    }

    setLoading(false)
  }

  return (
    <div className="checkout">
      <h2>Il tuo ordine</h2>

      {cart.map(item => (
        <div key={item.id} className="checkout-row">
          <span>{item.name} × {item.qty}</span>
          <span>€ {(item.price * item.qty).toFixed(2)}</span>
        </div>
      ))}

      <div className="checkout-total">
        Totale: € {total.toFixed(2)}
      </div>

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

      <button onClick={submitOrder} disabled={loading}>
        {loading ? 'Invio…' : 'Invia ordine'}
      </button>

      <button className="link" onClick={onClose}>
        Torna ai prodotti
      </button>
    </div>
  )
}
