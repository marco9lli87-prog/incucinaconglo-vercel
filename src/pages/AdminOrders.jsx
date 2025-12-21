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
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("tutti")
  const [editingOrderId, setEditingOrderId] = useState(null)
  const [editItems, setEditItems] = useState([])

  useEffect(() => {
    loadAll()
  }, [])

  const loadAll = async () => {
    setLoading(true)

    const { data: ordersData } = await supabase
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
          products ( id, name, price )
        )
      `)
      .order("created_at", { ascending: false })

    const { data: productsData } = await supabase
      .from("products")
      .select("id, name, price")
      .eq("active", true)

    setOrders(ordersData || [])
    setProducts(productsData || [])
    setLoading(false)
  }

  /* ======================
     STATUS / FILTRI
     ====================== */

  const updateStatus = async (orderId, status) => {
    await supabase.from("orders").update({ status }).eq("id", orderId)
    loadAll()
  }

  const filteredOrders =
    filter === "tutti"
      ? orders
      : orders.filter(o => o.status === filter)

  const orderedOrders = [
    ...filteredOrders.filter(o => o.status === "nuovo"),
    ...filteredOrders.filter(o => o.status !== "nuovo"),
  ]

  const newCount = orders.filter(o => o.status === "nuovo").length

  /* ======================
     MODIFICA ORDINE
     ====================== */

  const startEdit = (order) => {
    setEditingOrderId(order.id)
    setEditItems(
      order.order_items.map(i => ({
        product_id: i.products.id,
        name: i.products.name,
        price: i.products.price,
        quantity: i.quantity,
      }))
    )
  }

  const stopEdit = () => {
    setEditingOrderId(null)
    setEditItems([])
  }

  const changeQty = (index, delta) => {
    setEditItems(items =>
      items.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )
  }

  const removeItem = (index) => {
    setEditItems(items => items.filter((_, i) => i !== index))
  }

  const addProduct = (productId) => {
    const product = products.find(p => p.id === productId)
    if (!product) return

    setEditItems(items => {
      const existing = items.find(i => i.product_id === product.id)
      if (existing) {
        return items.map(i =>
          i.product_id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [
        ...items,
        {
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ]
    })
  }

  const saveEdit = async (orderId) => {
    await supabase.from("order_items").delete().eq("order_id", orderId)

    await supabase.from("order_items").insert(
      editItems.map(i => ({
        order_id: orderId,
        product_id: i.product_id,
        quantity: i.quantity,
      }))
    )

    const newTotal = editItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    )

    await supabase.from("orders").update({ total: newTotal }).eq("id", orderId)

    stopEdit()
    loadAll()
  }

  /* ======================
     WHATSAPP
     ====================== */

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
      <div style={titleRow}>
        <h1 style={title}>Ordini</h1>
        {newCount > 0 && (
          <span style={badge}>{newCount} nuovi</span>
        )}
      </div>

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

      {orderedOrders.map(order => (
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
                {item.products.name} x {item.quantity}
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

            <button
              style={btnSmall}
              onClick={() =>
                editingOrderId === order.id
                  ? stopEdit()
                  : startEdit(order)
              }
            >
              {editingOrderId === order.id ? "Chiudi" : "Modifica"}
            </button>
          </div>

          {editingOrderId === order.id && (
            <div style={editPanel}>
              {editItems.map((item, index) => (
                <div key={index} style={editRow}>
                  <span>{item.name}</span>
                  <div>
                    <button style={qtyBtn} onClick={() => changeQty(index, -1)}>-</button>
                    <span style={qty}>{item.quantity}</span>
                    <button style={qtyBtn} onClick={() => changeQty(index, 1)}>+</button>
                    <button style={removeBtn} onClick={() => removeItem(index)}>Rimuovi</button>
                  </div>
                </div>
              ))}

              <select style={select} onChange={e => addProduct(e.target.value)} defaultValue="">
                <option value="">Aggiungi prodotto</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <button style={saveBtn} onClick={() => saveEdit(order.id)}>
                Salva modifiche
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ================= STILI ================= */

const page = { padding: 16, color: "#fff" }
const titleRow = { display: "flex", alignItems: "center", gap: 10 }
const title = { color: "#d4af37" }
const badge = { background: "#facc15", color: "#000", padding: "4px 8px", borderRadius: 12, fontSize: 12 }
const filters = { display: "flex", gap: 6, margin: "12px 0" }
const filterBtn = { border: "none", borderRadius: 6, padding: "4px 8px" }
const card = { background: "#1a1a1a", padding: 12, borderRadius: 8, marginBottom: 12 }
const rowBetween = { display: "flex", justifyContent: "space-between", marginBottom: 4 }
const date = { fontSize: 12, opacity: 0.7 }
const meta = { fontSize: 13, opacity: 0.85, marginBottom: 6 }
const note = { fontSize: 13, opacity: 0.8, marginBottom: 6 }
const items = { fontSize: 14, marginBottom: 6, paddingLeft: 16 }
const actions = { display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }
const btnSmall = { background: "#2a2a2a", color: "#fff", border: "none", padding: "4px 8px", borderRadius: 6, fontSize: 12 }
const btnWhatsapp = { background: "#16a34a", color: "#fff", padding: "4px 8px", borderRadius: 6, fontSize: 12, textDecoration: "none" }
const editPanel = { marginTop: 10, paddingTop: 10, borderTop: "1px solid #333" }
const editRow = { display: "flex", justifyContent: "space-between", marginBottom: 6 }
const qtyBtn = { background: "#333", color: "#fff", border: "none", padding: "2px 6px", marginRight: 4 }
const qty = { marginRight: 4 }
const removeBtn = { background: "#b91c1c", color: "#fff", border: "none", padding: "2px 6px", marginLeft: 4 }
const select = { width: "100%", marginTop: 8, padding: 6 }
const saveBtn = { marginTop: 10, padding: 8, background: "#d4af37", color: "#000", border: "none", width: "100%" }

const statusColor = (status) => {
  if (status === "gestito") return "#facc15"
  if (status === "completato") return "#3b82f6"
  if (status === "annullato") return "#dc2626"
  return "#555"
}