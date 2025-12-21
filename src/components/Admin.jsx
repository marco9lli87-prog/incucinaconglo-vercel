import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

const STATUS = {
  NUOVO: "nuovo",
  GESTITO: "gestito",
  CONSEGNATO: "consegnato",
  ANNULLATO: "annullato",
}

export default function Admin() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [onlyNew, setOnlyNew] = useState(false)

  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [note, setNote] = useState("")

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })

    setOrders(data || [])
    setLoading(false)
  }

  /* =========================
     HELPERS
     ========================= */

  const resetForm = () => {
    setName("")
    setPhone("")
    setNote("")
    setEditing(null)
    setCreating(false)
  }

  /* =========================
     CRUD
     ========================= */

  const openEdit = (order) => {
    setEditing(order)
    setName(order.customer_name || "")
    setPhone(order.customer_phone || "")
    setNote(order.note || "")
  }

  const saveEdit = async () => {
    await supabase
      .from("orders")
      .update({
        customer_name: name,
        customer_phone: phone,
        note: note,
      })
      .eq("id", editing.id)

    resetForm()
    loadOrders()
  }

  const createOrder = async () => {
    if (!name || !phone) {
      alert("Nome e telefono obbligatori")
      return
    }

    await supabase.from("orders").insert({
      customer_name: name,
      customer_phone: phone,
      note,
      total: 0,
      status: STATUS.GESTITO,
    })

    resetForm()
    loadOrders()
  }

  const cancelOrder = async (id) => {
    if (!confirm("Annullare questo ordine?")) return

    await supabase
      .from("orders")
      .update({ status: STATUS.ANNULLATO })
      .eq("id", id)

    loadOrders()
  }

  const visibleOrders = onlyNew
    ? orders.filter(o => o.status === STATUS.NUOVO)
    : orders

  /* =========================
     RENDER
     ========================= */

  return (
    <div style={page}>
      <h1 style={title}>Admin ordini</h1>

      {/* TOP BAR */}
      <div style={topBar}>
        <button style={btnPrimary} onClick={() => setCreating(true)}>
          ➕ Nuovo ordine
        </button>

        <label style={{ fontSize: 14 }}>
          <input
            type="checkbox"
            checked={onlyNew}
            onChange={e => setOnlyNew(e.target.checked)}
          />{" "}
          Solo nuovi
        </label>
      </div>

      {loading && <p>Caricamento…</p>}

      {/* LISTA */}
      {visibleOrders.map(order => (
        <div key={order.id} style={card}>
          <div>
            <strong>{order.customer_name}</strong>{" "}
            <span style={{ color: "#d4af37" }}>
              € {Number(order.total).toFixed(2)}
            </span>
          </div>

          <div style={meta}>
            {order.customer_phone} · {order.status}
          </div>

          {order.note && <div style={noteStyle}>“{order.note}”</div>}

          <div style={actions}>
            <button style={btnEdit} onClick={() => openEdit(order)}>
              ✏️ Modifica
            </button>
            <button style={btnDanger} onClick={() => cancelOrder(order.id)}>
              🗑️ Annulla
            </button>
          </div>
        </div>
      ))}

      {/* MODALE */}
      {(editing || creating) && (
        <div style={overlay}>
          <div style={modal}>
            <h3 style={{ color: "#d4af37" }}>
              {editing ? "Modifica ordine" : "Nuovo ordine manuale"}
            </h3>

            <input
              style={input}
              placeholder="Nome cliente"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              style={input}
              placeholder="Telefono"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <textarea
              style={{ ...input, minHeight: 80 }}
              placeholder="Note"
              value={note}
              onChange={e => setNote(e.target.value)}
            />

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button
                style={btnPrimary}
                onClick={editing ? saveEdit : createOrder}
              >
                Salva
              </button>
              <button style={btnSecondary} onClick={resetForm}>
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* =========================
   STYLES (INLINE, A PROVA DI CSS GLOBALI)
   ========================= */

const page = {
  padding: 16,
  maxWidth: 720,
  margin: "0 auto",
  color: "#fff",
}

const title = {
  color: "#d4af37",
  marginBottom: 12,
}

const topBar = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  marginBottom: 16,
}

const card = {
  background: "#1a1a1a",
  borderRadius: 12,
  padding: 12,
  marginBottom: 10,
}

const meta = {
  fontSize: 12,
  color: "#aaa",
}

const noteStyle = {
  marginTop: 6,
  fontStyle: "italic",
  color: "#ccc",
}

const actions = {
  display: "flex",
  gap: 8,
  marginTop: 10,
}

const btnPrimary = {
  background: "#d4af37",
  color: "#000",
  border: "none",
  borderRadius: 8,
  padding: "6px 12px",
  fontWeight: 700,
}

const btnEdit = {
  background: "#4caf50",
  color: "#000",
  border: "none",
  borderRadius: 8,
  padding: "6px 10px",
}

const btnDanger = {
  background: "#c62828",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "6px 10px",
}

const btnSecondary = {
  background: "#333",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "6px 10px",
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
}

const modal = {
  background: "#1a1a1a",
  borderRadius: 12,
  padding: 16,
  width: "90%",
  maxWidth: 420,
}

const input = {
  width: "100%",
  marginTop: 8,
  padding: 8,
  borderRadius: 6,
  border: "1px solid #333",
  background: "#0f0f0f",
  color: "#fff",
}