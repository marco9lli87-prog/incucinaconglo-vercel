import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const STATUS_COLORS = {
  nuovo: '#d4af37',
  gestito: '#4caf50',
  consegnato: '#2196f3'
}

export default function Admin() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select(`
        id,
        created_at,
        customer_name,
        customer_phone,
        total,
        note,
        status,
        order_items (
          quantity,
          products ( name )
        )
      `)
      .order('created_at', { ascending: false })

    setOrders(data || [])
  }

  const updateStatus = async (id, status) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    loadOrders()
  }

  const whatsappMessage = order => {
    const items = order.order_items
      .map(i => `• ${i.products?.name} x${i.quantity}`)
      .join('\n')

    return encodeURIComponent(`
Ciao ${order.customer_name}! 😊
sono Glò 🍝

Ho ricevuto il tuo ordine e va tutto bene 👍

${items}

Totale: € ${order.total.toFixed(2)}

Possiamo sentirci per accordarci
su ritiro o consegna?
A presto 💛
`.trim())
  }

  return (
    <div style={{ padding: '1.25rem', maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ color: '#d4af37' }}>Ordini</h1>

      {orders.map(order => (
        <div
          key={order.id}
          style={{
            background: '#1a1a1a',
            padding: '1rem',
            borderRadius: 14,
            marginBottom: '1rem',
            borderLeft: `4px solid ${STATUS_COLORS[order.status]}`
          }}
        >
          <strong>{order.customer_name}</strong>{' '}
          <span style={{ color: STATUS_COLORS[order.status] }}>
            ● {order.status}
          </span>

          <p>{order.customer_phone}</p>

          <ul>
            {order.order_items.map((i, idx) => (
              <li key={idx}>
                {i.products?.name} × {i.quantity}
              </li>
            ))}
          </ul>

          <p><strong>Totale:</strong> € {order.total.toFixed(2)}</p>

          <div style={{ marginTop: 8 }}>
            <a
              href={`https://wa.me/39${order.customer_phone}?text=${whatsappMessage(order)}`}
              target="_blank"
              rel="noreferrer"
              style={{ marginRight: 8 }}
            >
              Scrivi su WhatsApp
            </a>

            {order.status !== 'gestito' && (
              <button onClick={() => updateStatus(order.id, 'gestito')}>
                Gestito
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}