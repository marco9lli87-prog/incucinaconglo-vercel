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
              background: filter === f ? "#d4af37" : "#333",
              color: filter === f ? "#000" : "#fff",
            }}
            onClick={() => setFilter(f)}
          >
            {f === "tutti" ? "Tutti" : STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 && <p>Nessun ordine</p>}

      {filteredOrders.map(order => (
        <div key={order.id} style={card}>
          <div style={rowBetween}>
            <strong>{order.customer_name}</strong>
            <span>{new Date(order.created_at).toLocaleString()}</span>
          </div>

          <div style={rowBetween}>
            <span>📞 {order.customer_phone}</span>
            <span style={statusBadge(order.status)}>
              {STATUS_LABELS[order.status] || order.status}
            </span>
          </div>

          {order.note && <div style={note}>Note: {order.note}</div>}

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
              style={btnWhatsapp}
            >
              WhatsApp
            </a>

            <button
              style={btnYellow}
              onClick={() => updateStatus(order.id, "gestito")}
            >
              In gestione
            </button>

            <button
              style={btnBlue}
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
  gap: 8,
  marginBottom: 16,
  flexWrap: "wrap",
}

const filterBtn = {
  border: "none",
  borderRadius: 8,
  padding: "6px 10px",
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
  gap: 8,
}

const note = {
  fontSize: 13,
  opacity: 0.8,
  marginBottom: 6,
}

const actions = {
  display: "flex",
  gap: 8,
  marginTop: 10,
  flexWrap: "wrap",
}

const statusBadge = (status) => ({
  padding: "4px 8px",
  borderRadius: 12,
  fontSize: 12,
  background:
    status === "gestito"
      ? "#facc15"
      : status === "completato"
      ? "#3b82f6"
      : "#555",
  color:
    status === "gestito"
      ? "#000"
      : "#fff",
})

const btnWhatsapp = {
  background: "#16a34a",
  color: "#fff",
  padding: "6px 12px",
  borderRadius: 6,
  textDecoration: "none",
}

const btnYellow = {
  background: "#facc15",
  color: "#000",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
}

const btnBlue = {
  background: "#3b82f6",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
}