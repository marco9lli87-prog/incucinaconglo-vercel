import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Checkout({ cart, setCart, onClose, onClear }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

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

    /* =========================
       MESSAGGIO WHATSAPP
       ========================= */

    const orderLines = cart
      .map(
        i =>
          `• ${i.name} x${i.qty} – € ${(i.price * i.qty).toFixed(2)}`
      )
      .join('\n')

    const message = `
Ciao Glò! 👋  
sono ${name} 😊

Ho appena fatto un ordine dal sito *In Cucina con Glò* 🍝

🧺 *Il mio ordine:*
${orderLines}

💰 *Totale:* € ${total.toFixed(2)}

${note ? `📝 Note: ${note}` : ''}

Quando preferisci sentirci per confermare
ritiro o consegna?  
Grazie! 🙏
`.trim()

    const whatsappNumber = '393477481222' // <-- METTI QUI IL TUO NUMERO
    const whatsappUrl =
      `https://wa.me/${whatsappNumber}?text=` +
      encodeURIComponent(message)

    /* =========================
       APERTURA IMMEDIATA WHATSAPP
       (iOS / Safari SAFE)
       ========================= */

    window.location.href = whatsappUrl

    /* =========================
       SALVATAGGIO ORDINE
       IN BACKGROUND
       ========================= */

    try {
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

      if (!error && order) {
        const items = cart.map(i => ({
          order_id: order.id,
          product_id: i.id,
          quantity: i.qty,
          price: i.price
        }))

        await supabase.from('order_items').insert(items)
      }
    } catch (err) {
      console.error('Errore salvataggio ordine:', err)
    }

    onClear()
    onClose()
    setLoading(false)
  }

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div
        className="checkout-sheet"
        onClick={e => e.stopPropagation()}
      >
        <div className="sheet-handle" />

        <h2>Riepilogo ordine</h2>

        <div className="checkout-summary">
          {cart.map(item => (
            <div key={item.id} className="checkout-row">
              <span>{item.name}</span>

              <div className="checkout-qty">
                <button onClick={() => updateQty(item.id, -1)}>
                  −
                </button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)}>
                  +
                </button>
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
          Dopo l’invio verrai indirizzato su WhatsApp per confermare
          l’ordine e accordarci su ritiro o consegna.
          Nessun pagamento online.
        </p>

        <button
          className="checkout-submit"
          onClick={submitOrder}
          disabled={loading}
        >
          {loading ? 'Invio…' : 'Invia ordine'}
        </button>

        <button className="checkout-cancel" onClick={onClose}>
          Torna ai prodotti
        </button>
      </div>
    </div>
  )
}