import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const STATUS_COLORS = {
  nuovo: '#d4af37',
  gestito: '#4caf50',
  consegnato: '#2196f3'
}

const STATUS_ORDER = {
  nuovo: 1,
  gestito: 2,
  consegnato: 3
}

export default function Admin() {
  const [orders, setOrders] = useState([])
  const [onlyNew, setOnlyNew] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)

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

    const sorted = (data || [])
      .sort(
        (a, b) =>
          STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
          new Date(b.created_at) - new Date(a.created_at)
      )

    setOrders(sorted)
  }

  const updateStatus = async (id, status) => {
    setUpdatingId(id)

    await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)

    setOrders(prev =>
      prev.map(o =>
        o.id === id ? { ...o, status } : o
      )
    )

    setUpdatingId(null)
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

  const visibleOrders = onlyNew
    ? orders.filter(o => o.status === 'nuovo')
    : orders

  return (
    <div style={{ padding: '1.25rem', maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ color: '#d4af37', marginBottom: '0.5rem' }}>
        Ordini
      </h1>

      {/* FILTRO */}
      <label style={{ fontSize: '0.85rem', color: '#ccc' }}>
        <input
          type="checkbox"
          checked={onlyNew}
          onChange={e => setOnlyNew(e.target.checked)}
          style={{ marginRight: 6 }}
        />
        Mostra solo nuovi
      </label>

      {visibleOrders.map(order => (
        <div
          key={order.id}
          style={{
            background: '#1a1a1a',
            padding: '1rem',
            borderRadius: 14,
            marginTop: '1rem',
            borderLeft: `4px solid ${STATUS_COLORS[order.status]}`
          }}
        >
          <strong>{order.customer_name}</strong>{' '}
          <span style={{ color: STATUS_COLORS[order.status] }}>
            ● {order.status}
          </span>

          <p style={{ fontSize: '0.85rem' }}>
            {order.customer_phone}
          </p>

          <ul style={{ marginTop: 6 }}>
            {order.order_items.map((i, idx) => (
              <li key={idx}>
                {i.products?.name} × {i.quantity}
              </li>
            ))}
          </ul>

          <p style={{ marginTop: 6 }}>
            <strong>Totale:</strong> € {order.total.toFixed(2)}
          </p>

          {order.note && (
            <p style={{ fontStyle: 'italic', color: '#ccc' }}>
              Note: {order.note}
            </p>
          )}

          {/* AZIONI */}
          <div style={{ marginTop: 10 }}>
            <a
              href={`https://wa.me/39${order.customer_phone}?text=${whatsappMessage(order)}`}
              target="_blank"
              rel="noreferrer"
              style={{
                marginRight: 10,
                color: '#d4af37',
                textDecoration: 'none'
              }}
            >
              Scrivi su WhatsApp
            </a>

            {order.status === 'nuovo' && (
              <button
                disabled={updatingId === order.id}
                onClick={() => updateStatus(order.id, 'gestito')}
                style={{
                  marginRight: 6,
                  background: '#4caf50',
                  color: '#000',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.35rem 0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  opacity: updatingId === order.id ? 0.6 : 1,
                  cursor: 'pointer'
                }}
              >
                Gestito
              </button>
            )}

            {order.status !== 'consegnato' && (
              <button
                disabled={updatingId === order.id}
                onClick={() => updateStatus(order.id, 'consegnato')}
                style={{
                  background: '#2196f3',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.35rem 0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  opacity: updatingId === order.id ? 0.6 : 1,
                  cursor: 'pointer'
                }}
              >
                Completa
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}