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

    const sorted = (data || []).sort(
      (a, b) =>
        STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
        new Date(b.created_at) - new Date(a.created_at)
    )

    setOrders(sorted)
  }

  const sendWhatsappConfirmation = order => {
    const items = order.order_items
      .map(i => `• ${i.products?.name} x${i.quantity}`)
      .join('\n')

    const message = `
Ciao ${order.customer_name}! 😊
sono Glò 🍝

Ho preso in carico il tuo ordine 👍

${items}

Totale: € ${order.total.toFixed(2)}

Possiamo accordarci per
ritiro o consegna?
A presto 💛
`.trim()

    window.open(
      `https://wa.me/39${order.customer_phone}?text=${encodeURIComponent(message)}`,
      '_blank'
    )
  }

  const updateStatus = async (order, newStatus) => {
    setUpdatingId(order.id)

    await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', order.id)

    setOrders(prev =>
      prev.map(o =>
        o.id === order.id ? { ...o, status: newStatus } : o
      )
    )

    // WhatsApp automatico SOLO quando diventa "gestito"
    if (order.status === 'nuovo' && newStatus === 'gestito') {
      sendWhatsappConfirmation(order)
    }

    setUpdatingId(null)
  }

  const visibleOrders = onlyNew
    ? orders.filter(o => o.status === 'nuovo')
    : orders

  const newCount = orders.filter(o => o.status === 'nuovo').length

  return (
    <div style={{ padding: '1.25rem', maxWidth: 600, margin: '0 auto' }}>
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}
      >
        <h1 style={{ color: '#d4af37', marginRight: 8 }}>
          Ordini
        </h1>

        {newCount > 0 && (
          <span
            style={{
              background: '#d4af37',
              color: '#000',
              borderRadius: 999,
              padding: '0.2rem 0.55rem',
              fontSize: '0.75rem',
              fontWeight: 600
            }}
          >
            {newCount}
          </span>
        )}
      </div>

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
            {order.status === 'nuovo' && (
              <button
                disabled={updatingId === order.id}
                onClick={() => updateStatus(order, 'gestito')}
                style={{
                  marginRight: 6,
                  background: '#4caf50',
                  color: '#000',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.35rem 0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  opacity: updatingId === order.id ? 0.6 : 1
                }}
              >
                Gestito
              </button>
            )}

            {order.status !== 'consegnato' && (
              <button
                disabled={updatingId === order.id}
                onClick={() => updateStatus(order, 'consegnato')}
                style={{
                  background: '#2196f3',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.35rem 0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  opacity: updatingId === order.id ? 0.6 : 1
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