import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        created_at,
        customer_name,
        customer_phone,
        note,
        total,
        status,
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

  const updateStatus = async (orderId, newStatus) => {
    await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId)

    fetchOrders()
  }

  const openWhatsapp = (order) => {
    if (!order.customer_phone) return

    const itemsText = order.order_items
      .map(i => `- ${i.products.name} x${i.quantity}`)
      .join("\n")

    const message =
      "Ciao " +
      order.customer_name +
      ",\n" +
      "ti scrivo da In Cucina con Glo.\n\n" +
      "Riepilogo ordine:\n" +
      itemsText +
      "\n\nTotale: EUR " +
      Number(order.total).toFixed(2) +
      "\n\nA presto."

    const url =
      "https://wa.me/" +
      order.customer_phone +
      "?text=" +
      encodeURIComponent(message)

    window.open(url, "_blank")
  }

  return (
    <div style={page}>
      <h1 style={title}>Ordini</h1>

      {loading && <p>Caricamento...</p>}

      {!loading && orders.length === 0 && (
        <p>Nessun ordine presente.</p>
      )}

      {orders.map(order => (
        <div key={order.id} style={card}>
          <div style={row}>
            <strong>{order.customer_name}</strong>
            <span style={price}>
              EUR {Number(order.total).toFixed(2)}
            </span>
          </div>

          <div style={meta}>
            {order.customer_phone} | {order.status}
          </div>

          {order.note && (
            <div style={note}>Note: {order.note}</div>
          )}

          <div style={items}>
            {order.order_items.map(item => (
              <div key={item.id}>
                {item.products.name} x{item.quantity}
              </div>
            ))}
          </div>

          <div style={actions}>
            <button
              style={btn}
              onClick={() => openWhatsapp(order)}
            >
              WhatsApp
            </button>

            <button
              style={btn}
              onClick={() => updateStatus(order.id, "gestito")}
            >
              Gestito
            </button>

            <button
              style={btn}
              onClick={() => updateStatus(order.id, "completato")}
            >
              Completato
            </button>

            <button
              style={btnDanger}
              onClick={() => updateStatus(order.id, "annullato")}
            >
              Annullato
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ======================
   STILI INLINE SAFE
   ====================== */

const page = {
  padding: 16,
  maxWidth: 800,
  margin: "0 auto",
  color: "#fff",
}

const title = {
  color: "#d4af37",
  marginBottom: 16,
}

const card = {
  background: "#1a1a1a",
  borderRadius: 12,
  padding: 12,
  marginBottom: 12,
}

const row = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 4,
}

const price = {
  color: "#d4af37",
}

const meta = {
  fontSize: 12,
  color: "#aaa",
  marginBottom: 6,
}

const note = {
  fontSize: 13,
  color: "#ccc",
  marginBottom: 6,
}

const items = {
  marginBottom: 8,
  fontSize: 14,
}

const actions = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
}

const btn = {
  background: "#333",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "6px 10px",
}

const btnDanger = {
  background: "#b00020",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "6px 10px",
}