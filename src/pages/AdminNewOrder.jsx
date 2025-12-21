import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function AdminNewOrder() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [note, setNote] = useState("")

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)

    setProducts(data || [])
  }

  const addProduct = (product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id)
      if (existing) {
        return prev.map(p =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const createOrder = async () => {
    if (!name || !phone || cart.length === 0) {
      alert("Compila nome, telefono e prodotti")
      return
    }

    const { data: order } = await supabase
      .from("orders")
      .insert({
        customer_name: name,
        customer_phone: phone,
        note,
        total,
        status: "gestito",
      })
      .select()
      .single()

    const items = cart.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
    }))

    await supabase.from("order_items").insert(items)

    alert("Ordine creato")

    setName("")
    setPhone("")
    setNote("")
    setCart([])
  }

  return (
    <div style={page}>
      <h1 style={title}>Nuovo ordine</h1>

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
        style={input}
        placeholder="Note"
        value={note}
        onChange={e => setNote(e.target.value)}
      />

      <h3>Prodotti</h3>

      {products.map(p => (
        <button
          key={p.id}
          style={btn}
          onClick={() => addProduct(p)}
        >
          {p.name} - EUR {p.price}
        </button>
      ))}

      <h3>Riepilogo</h3>

      {cart.map(item => (
        <div key={item.id}>
          {item.name} x{item.quantity}
        </div>
      ))}

      <p>Totale: EUR {total.toFixed(2)}</p>

      <button style={btnPrimary} onClick={createOrder}>
        Crea ordine
      </button>
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
}

const input = {
  width: "100%",
  marginBottom: 8,
  padding: 8,
  background: "#0f0f0f",
  color: "#fff",
  border: "1px solid #333",
}

const btn = {
  display: "block",
  width: "100%",
  marginBottom: 6,
  padding: 8,
  background: "#1a1a1a",
  color: "#fff",
  border: "none",
}

const btnPrimary = {
  marginTop: 12,
  padding: 10,
  background: "#d4af37",
  color: "#000",
  border: "none",
}