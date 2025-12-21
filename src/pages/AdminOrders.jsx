import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        customer_name,
        customer_phone,
        note,
        total,
        status,
        created_at,
        order_items (
          id,
          quantity,
          products (
            name
          )
        )
      `)
      .order("created_at", { ascending: false })

    if (!error) {
      setOrders(data || [])
    }

    setLoading(false)
  }

  const updateStatus = async (orderId, status) => {
    await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)

    loadOrders()
  }

  const whatsappLink = (order) => {
    if (!order.customer_phone) return "#"

    const message = `Ciao ${order.customer_name},

ho ricevuto il tuo ordine.
Ti aggiorno a breve.

Glò`

    return (
      "https://wa.me/" +
      order.customer_phone.replace(/\D/g, "") +
      "?text=" +
      encodeURIComponent(message)
    )
  }

  if (loading) {
    return <div style={page}>Caricamento ordini...</div>
  }

  return (
    <div style={page}>
      <h1 style={title}>Ordini</h1>

      {orders.length === 0 && <p>Nessun ordine</p>}

      {orders.map(order => (
        <div key={order.id} style={card}>
          <div style={rowBetween}>
            <strong>{order.customer_name}</strong>
            <span>{new Date(order.created_at).toLocaleString()}</span>
          </div>

          <div>Telefono: {order.customer_phone}</div>
          {order.note && <div>Note: {order.note}</div>}

          <ul>
            {order.order_items.map(item => (
              <li key={item.id}>
                {item.products?.name} x {item.quantity}
              </li>
            ))}
          </ul>

          <div style={rowBetween}>
            <strong>Totale</strong>
            <strong>€ {Number(order.total).toFixed(2)}</strong>
          </div>

          <div style={actions}>
            <a
              href={whatsappLink(order)}
              target="_blank"
              rel="noopener noreferrer"
              style={btnBlue}
            >
              WhatsApp
            </a>

            <button
              style={btnGray}
              onClick={() => updateStatus(order.id, "gestito")}
            >
              Gestito
            </button>

            <button
              style={btnGreen}
              onClick={() => updateStatus(order.id, "completato")}
            >
              Completato
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ===== STILI SAFE ===== */

const page = {
  padding: 16,
  color: "#fff",
}

const title = {
  color: "#d4af37",
  marginBottom: 16,
}

const card = {
  background: "#1a1a1a",
  padding: 12,
  borderRadius: 10,
  marginBottom: 16,
}

const rowBetween = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 6,
}

const actions = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 10,
}

const btnBlue = {
  background: "#2563eb",
  color: "#fff",
  padding: "6px 12px",
  borderRadius: 6,
  textDecoration: "none",
}

const btnGray = {
  background: "#444",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
}

const btnGreen = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
}