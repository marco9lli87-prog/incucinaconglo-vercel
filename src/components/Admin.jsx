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

  // modali
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)

  // form
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
     EDIT / CREATE
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

    setEditing(null)
    loadOrders()
  }

  const cancelOrder = async (orderId) => {
    if (!confirm("Annullare questo ordine?")) return

    await supabase
      .from("orders")
      .update({ status: STATUS.ANNULLATO })
      .eq("id", orderId)

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

    setCreating(false)
    setName("")
    setPhone("")
    setNote("")
    loadOrders()
  }

  const visibleOrders = onlyNew
    ? orders.filter(o => o.status === STATUS.NUOVO)
    : orders

  /* ========================= */

  return (
    <div style={{ padding: 16, maxWidth: 720, margin: "0 auto", color: "#fff" }}>
      <h1 style={{ color: "#d4af37" }}>Admin Ordini</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button
          onClick={() => setCreating(true)}
          style={{ background: "#d4af37", border: 0, padding: "6px 10px" }}
        >
          + Nuovo ordine
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

      {visibleOrders.map(order => (
        <div
          key={order.id}
          style={{
            background: "#1a1a1a",
            borderRadius: 12,
            padding: 12,
            marginBottom: 10,
          }}
        >
          <strong>{order.customer_name}</strong>{" "}
          <span style={{ color: "#d4af37" }}>
            € {Number(order.total).toFixed(2)}
          </span>

          <div style={{ fontSize: 12, color: "#aaa" }}>
            {order.customer_phone} · {order.status}
          </div>

          {order.note && (
            <div style={{ fontStyle: "italic", marginTop: 4 }}>
              “{order.note}”
            </div>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={() => openEdit(order)}>✏️ Modifica</button>
            <button onClick={() => cancelOrder(order.id)}>🗑️ Annulla</button>
          </div>
        </div>
      ))}

      {/* MODALE */}
      {(editing || creating) && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#1a1a1a",
              padding: 16,
              borderRadius: 12,
              width: "90%",
              maxWidth: 420,
            }}
          >
            <h3 style={{ color: "#d4af37" }}>
              {editing ? "Modifica ordine" : "Nuovo ordine manuale"}
            </h3>

            <input
              style={inputStyle}
              placeholder="Nome cliente"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              style={inputStyle}
              placeholder="Telefono"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <textarea
              style={{ ...inputStyle, minHeight: 80 }}
              placeholder="Note"
              value={note}
              onChange={e => setNote(e.target.value)}
            />

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button
                onClick={editing ? saveEdit : createOrder}
                style={{ background: "#4caf50", border: 0, padding: "6px 10px" }}
              >
                Salva
              </button>
              <button
                onClick={() => {
                  setEditing(null)
                  setCreating(false)
                }}
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const inputStyle = {
  width: "100%",
  marginTop: 8,
  padding: 8,
  borderRadius: 6,
  border: "1px solid #333",
  background: "#0f0f0f",
  color: "#fff",
}