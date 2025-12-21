import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    const { data } = await supabase.from("products").select("*")
    setProducts(data || [])
  }

  const addProduct = async () => {
    if (!name || !price) return

    await supabase.from("products").insert({
      name,
      price: Number(price),
      active: true,
    })

    setName("")
    setPrice("")
    loadProducts()
  }

  const toggleActive = async (product) => {
    await supabase
      .from("products")
      .update({ active: !product.active })
      .eq("id", product.id)

    loadProducts()
  }

  return (
    <div style={page}>
      <h1 style={title}>Prodotti</h1>

      <input
        style={input}
        placeholder="Nome prodotto"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        style={input}
        placeholder="Prezzo"
        value={price}
        onChange={e => setPrice(e.target.value)}
      />

      <button style={btnPrimary} onClick={addProduct}>
        Aggiungi prodotto
      </button>

      <hr />

      {products.map(p => (
        <div key={p.id} style={row}>
          <span>
            {p.name} - EUR {p.price}
          </span>

          <button
            style={btn}
            onClick={() => toggleActive(p)}
          >
            {p.active ? "Disattiva" : "Attiva"}
          </button>
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
}

const input = {
  width: "100%",
  marginBottom: 8,
  padding: 8,
  background: "#0f0f0f",
  color: "#fff",
  border: "1px solid #333",
}

const btnPrimary = {
  marginBottom: 12,
  padding: 10,
  background: "#d4af37",
  color: "#000",
  border: "none",
}

const row = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 6,
}

const btn = {
  background: "#333",
  color: "#fff",
  border: "none",
  padding: "4px 8px",
}