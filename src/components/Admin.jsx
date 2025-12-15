import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const STATUS_COLORS = {
  nuovo: '#d4af37',
  gestito: '#4caf50',
  consegnato: '#2196f3'
}

export default function Admin() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

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
          price,
          products ( name )
        )
      `)
      .order('created_at', { ascending: false })

    setOrders(data || [])
    setLoading(false)
  }

  const updateStatus = async (orderId, newStatus) => {
    await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    setOrders(prev =>
      prev.map(o =>
        o.id === orderId ? { ...o, status: newStatus } : o
      )
    )
  }

  return (
    <div style={{ padding: '1.25rem', maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ color: '#d4af37', marginBottom: '1rem' }}>
        Ordini ricevuti
      </h1>

      {loading && <p>Caricamento…</p>}

      {orders.map(order => (
        <div
          key={order.id}
          style={{
            background: '#1a1a1a',
            borderRadius: 14,
            padding: '1rem',
            marginBottom: '1rem',
            borderLeft: `4px solid ${STATUS_COLORS[order.status]}`
          }}
        >
          <strong>{order.customer_name}</strong>{' '}
          <span
            style={{
              fontSize: '0.75rem',
              color: STATUS_COLORS[order.status],
              marginLeft: 6
            }}
          >
            ● {order.status}
          </span>

          <br />

          <a
            href={`https://wa.me/39${order.customer_phone}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: '#d4af37' }}
          >
            {order.customer_phone}
          </a>

          <p style={{ fontSize: '0.75rem', color: '#999' }}>
            {new Date(order.created_at).toLocaleString()}
          </p>

          <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
            {order.order_items.map((item, idx) => (
              <li key={idx}>
                {item.products?.name} × {item.quantity}
              </li>
            ))}
          </ul>

          <p style={{ marginTop: '0.5rem' }}>
            <strong>Totale:</strong> € {order.total.toFixed(2)}
          </p>

          {order.note && (
            <p style={{ fontStyle: 'italic', color: '#ccc' }}>
              Note: {order.note}
            </p>
          )}

          {/* AZIONI */}
          <div style={{ marginTop: '0.75rem' }}>
            {order.status !== 'gestito' && (
              <button
                onClick={() => updateStatus(order.id, 'gestito')}
                style={{ marginRight: 8 }}
              >
                Segna come gestito
              </button>
            )}

            {order.status !== 'consegnato' && (
              <button
                onClick={() => updateStatus(order.id, 'consegnato')}
              >
                Segna come consegnato
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}