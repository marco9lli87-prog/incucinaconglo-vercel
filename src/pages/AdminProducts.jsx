import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [uploading, setUploading] = useState(false)

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

  /* ======================
     UPLOAD IMMAGINE
     ====================== */

  const uploadImage = async (file, productId) => {
    if (!file) return
    setUploading(true)

    const ext = file.name.split(".").pop()
    const fileName = `${productId}.${ext}`

    await supabase.storage
      .from("products")
      .upload(fileName, file, { upsert: true })

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(fileName)

    await supabase
      .from("products")
      .update({ image_url: data.publicUrl })
      .eq("id", productId)

    setUploading(false)
    loadProducts()
  }

  /* ======================
     CRUD PRODOTTI
     ====================== */

  const addProduct = async () => {
    if (!name || !price) return

    const { data } = await supabase
      .from("products")
      .insert({
        name,
        price: Number(price),
        active: true,
      })
      .select()
      .single()

    setName("")
    setPrice("")
    loadProducts()

    return data
  }

  const updateProduct = async (id, fields) => {
    await supabase.from("products").update(fields).eq("id", id)
    loadProducts()
  }

  const deleteProduct = async (id) => {
    const ok = window.confirm(
      "Vuoi davvero eliminare questo prodotto?\nL’operazione non è reversibile."
    )
    if (!ok) return

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

        <div style={priceRow}>
          <span style={euro}>€</span>
          <input
            style={priceInput}
            placeholder="Prezzo"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
        </div>

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
            <span
              style={{
                ...statusBadge,
                background: product.active ? "#16a34a" : "#555",
              }}
              onClick={() =>
                updateProduct(product.id, {
                  active: !product.active,
                })
              }
            >
              {product.active ? "Attivo" : "Non attivo"}
            </span>

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

          <div style={priceRow}>
            <span style={euro}>€</span>
            <input
              style={priceInput}
              value={product.price}
              onChange={e =>
                updateProduct(product.id, {
                  price: Number(e.target.value),
                })
              }
            />
          </div>

          <input
            type="file"
            accept="image/*"
            style={fileInput}
            onChange={e =>
              uploadImage(e.target.files[0], product.id)
            }
          />

          {uploading && <div style={uploadingText}>Upload in corso…</div>}
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
  gap: 8,
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

const priceRow = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  marginTop: 6,
}

const euro = { opacity: 0.8 }

const priceInput = {
  flex: 1,
  padding: 6,
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

const statusBadge = {
  padding: "4px 10px",
  borderRadius: 12,
  fontSize: 12,
  color: "#fff",
  cursor: "pointer",
}

const image = {
  height: 80,
  width: "auto",
  maxWidth: "100%",
  objectFit: "contain",
  margin: "8px 0",
  borderRadius: 6,
}

const fileInput = {
  marginTop: 6,
  color: "#fff",
}

const uploadingText = {
  fontSize: 12,
  opacity: 0.7,
  marginTop: 4,
}