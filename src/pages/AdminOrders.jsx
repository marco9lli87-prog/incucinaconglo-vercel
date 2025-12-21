import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

const STATUS_LABELS = {
  nuovo: "Nuovo",
  gestito: "In gestione",
  completato: "Completato",
  annullato: "Annullato",
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("tutti")

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)

    const { data } = await supabase
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
          products ( name )
        )
      `)
      .order("created_at", { ascending: false })

    setOrders(data || [])
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

  const filteredOrders =
    filter === "tutti"
      ? orders
      : orders.filter(o => o.status === filter)

  if (loading) {
    return <div style={page}>Caricamento ordini...</div>
  }

  return (
    <div style={page}>
      <h1 style={title}>Ordini</h1>

      {/* FILTRO */}
      <div style={filters}>
        {["tutti", "nuovo", "gestito", "completato"].map(f => (
          <button
            key={f}
            style={{
              ...filterBtn,
              background: filter === f ? "#d4af37" : "#2a2a2a",
              color: filter === f ? "#000" : "#fff",
            }}
            onClick={() => setFilter(f)}
          >
            {f === "tutti" ? "Tutti" : STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      {filteredOrders.map(order => (
        <div
          key={order.id}
          style={{
            ...card,
            borderLeft: `4px solid ${statusColor(order.status)}`,
          }}
        >
          <div style={rowBetween}>
            <strong>{order.customer_name}</strong>
            <span style={date}>
              {new Date(order.created_at).toLocaleString()}
            </span>
          </div>

          <div style={meta}>
            {order.customer_phone} · {STATUS_LABELS[order.status]}
          </div>

          {order.note && <div style={note}>{order.note}</div>}

          <ul style={items}>
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
              style={btnWhatsapp}
            >
              WhatsApp
            </a>

            <button
              style={btnSmall}
              onClick={() => updateStatus(order.id, "gestito")}
            >
              Gestione
            </button>

            <button
              style={btnSmall}
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

/* ================= STILI ================= */

const page = {
  padding: 16,
  color: "#fff",
}

const title = {
  color: "#d4af37",
  marginBottom: 12,
}

const filters = {
  display: "flex",
  gap: 6,
  marginBottom: 14,
  flexWrap: "wrap",
}

const filterBtn = {
  border: "none",
  borderRadius: 6,
  padding: "4px 8px",
  fontSize: 13,
}

const card = {
  background: "#1a1a1a",
  padding: 12,
  borderRadius: 8,
  marginBottom: 12,
}

const rowBetween = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 4,
}

const date = {
  fontSize: 12,
  opacity: 0.7,
}

const meta = {
  fontSize: 13,
  opacity: 0.85,
  marginBottom: 6,
}

const note = {
  fontSize: 13,
  opacity: 0.8,
  marginBottom: 6,
}

const items = {
  fontSize: 14,
  marginBottom: 6,
  paddingLeft: 16,
}

const actions = {
  display: "flex",
  gap: 6,
  marginTop: 8,
  flexWrap: "wrap",
}

const btnSmall = {
  background: "#2a2a2a",
  color: "#fff",
  border: "none",
  padding: "4px 8px",
  borderRadius: 6,
  fontSize: 12,
}

const btnWhatsapp = {
  background: "#16a34a",
  color: "#fff",
  padding: "4px 8px",
  borderRadius: 6,
  fontSize: 12,
  textDecoration: "none",
}

/* ===== UTILS ===== */

const statusColor = (status) => {
  if (status === "gestito") return "#facc15"
  if (status === "completato") return "#3b82f6"
  if (status === "annullato") return "#dc2626"
  return "#555"
}