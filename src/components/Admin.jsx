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
     CRUD ORDINI
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

  /* ========================= */

  const visibleOrders = onlyNew
    ? orders.filter(o => o.status === STATUS.NUOVO)
    : orders

  return (
    <div style={{ padding: 16, maxWidth: 720, margin: "0 auto", color: "#fff" }}>
      <h1 style={{ color: "#d4af37" }}>Admin Ordini</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <button onClick={() => setCreating(true)}>+ Nuovo ordine</button>

        <label>
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

      {/* MODALE EDIT */}
      {editing && (
        <div className="checkout-overlay">
          <div className="checkout-panel">
            <h3>Modifica ordine</h3>

            <input
              placeholder="Nome"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              placeholder="Telefono"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <textarea
              placeholder="Note"
              value={note}
              onChange={e => setNote(e.target.value)}
            />

            <button onClick={saveEdit}>Salva</button>
            <button onClick={() => setEditing(null)}>Chiudi</button>
          </div>
        </div>
      )}

      {/* MODALE CREA */}
      {creating && (
        <div className="checkout-overlay">
          <div className="checkout-panel">
            <h3>Nuovo ordine manuale</h3>

            <input
              placeholder="Nome"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              placeholder="Telefono"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <textarea
              placeholder="Note"
              value={note}
              onChange={e => setNote(e.target.value)}
            />

            <button onClick={createOrder}>Crea ordine</button>
            <button onClick={() => setCreating(false)}>Chiudi</button>
          </div>
        </div>
      )}
    </div>
  )
}