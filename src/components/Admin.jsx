import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Admin() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        created_at,
        customer_name,
        customer_phone,
        total,
        note,
        order_items (
          quantity,
          price,
          products ( name )
        )
      `)
      .order('created_at', { ascending: false })

    if (!error) setOrders(data || [])
    setLoading(false)
  }

  return (
    <div style={{ padding: '1.25rem', maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ color: '#d4af37', marginBottom: '1rem' }}>
        Ordini ricevuti
      </h1>

      {loading && <p>Caricamento…</p>}

      {!loading && orders.length === 0 && (
        <p>Nessun ordine ancora.</p>
      )}

      {orders.map(order => (
        <div
          key={order.id}
          style={{
            background: '#1a1a1a',
            borderRadius: 14,
            padding: '1rem',
            marginBottom: '1rem'
          }}
        >
          <strong>{order.customer_name}</strong><br />
          <a
            href={`https://wa.me/39${order.customer_phone}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: '#d4af37' }}
          >
            {order.customer_phone}
          </a>

          <p style={{ fontSize: '0.8rem', color: '#999' }}>
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
        </div>
      ))}
    </div>
  )
}
