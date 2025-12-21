import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("name")

    setProducts(data || [])
    setLoading(false)
  }

  const addProduct = async () => {
    if (!name || !price) return

    await supabase.from("products").insert({
      name,
      price: Number(price),
      image_url: imageUrl || null,
      active: true,
    })

    setName("")
    setPrice("")
    setImageUrl("")
    loadProducts()
  }

  const updateProduct = async (id, fields) => {
    await supabase.from("products").update(fields).eq("id", id)
    loadProducts()
  }

  const deleteProduct = async (id) => {
    if (!window.confirm("Eliminare prodotto?")) return
    await supabase.from("products").delete().eq("id", id)
    loadProducts()
  }

  if (loading) {
    return <div style={page}>Caricamento prodotti...</div>
  }

  return (
    <div style={page}>
      <h1 style={title}>Prodotti</h1>

      {/* NUOVO PRODOTTO */}
      <div style={card}>
        <strong>Aggiungi prodotto</strong>

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

        <input
          style={input}
          placeholder="Image URL (facoltativo)"
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
        />

        <button style={btnPrimary} onClick={addProduct}>
          Aggiungi
        </button>
      </div>

      {/* LISTA PRODOTTI */}
      {products.map(product => (
        <div key={product.id} style={card}>
          <div style={rowBetween}>
            <strong>{product.name}</strong>
            <span>€ {Number(product.price).toFixed(2)}</span>
          </div>

          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.name}
              style={image}
            />
          )}

          <div style={rowBetween}>
            <label>
              <input
                type="checkbox"
                checked={product.active}
                onChange={() =>
                  updateProduct(product.id, {
                    active: !product.active,
                  })
                }
              />{" "}
              Attivo
            </label>

            <button
              style={btnDanger}
              onClick={() => deleteProduct(product.id)}
            >
              Elimina
            </button>
          </div>

          <input
            style={input}
            value={product.name}
            onChange={e =>
              updateProduct(product.id, {
                name: e.target.value,
              })
            }
          />

          <input
            style={input}
            value={product.price}
            onChange={e =>
              updateProduct(product.id, {
                price: Number(e.target.value),
              })
            }
          />

          <input
            style={input}
            value={product.image_url || ""}
            placeholder="Image URL"
            onChange={e =>
              updateProduct(product.id, {
                image_url: e.target.value,
              })
            }
          />
        </div>
      ))}
    </div>
  )
}

/* ================= STILI ================= */

const page = { padding: 16, color: "#fff" }
const title = { color: "#d4af37", marginBottom: 12 }

const card = {
  background: "#1a1a1a",
  padding: 12,
  borderRadius: 8,
  marginBottom: 16,
}

const rowBetween = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 8,
}

const input = {
  width: "100%",
  padding: 6,
  marginTop: 6,
  background: "#0f0f0f",
  color: "#fff",
  border: "1px solid #333",
  borderRadius: 4,
}

const btnPrimary = {
  marginTop: 10,
  padding: 8,
  background: "#d4af37",
  color: "#000",
  border: "none",
  width: "100%",
}

const btnDanger = {
  background: "#b91c1c",
  color: "#fff",
  border: "none",
  padding: "4px 8px",
  borderRadius: 6,
}

const image = {
  height: 80,
  width: "auto",
  maxWidth: "100%",
  objectFit: "contain",
  margin: "8px 0",
  borderRadius: 6,
}