import { useNavigate } from "react-router-dom"

export default function AdminDashboard() {
  const navigate = useNavigate()

  return (
    <div style={page}>
      <h1 style={title}>Admin</h1>

      <div style={grid}>
        <button style={btn} onClick={() => navigate("/admin/orders")}>
          Gestione ordini
        </button>

        <button style={btn} onClick={() => navigate("/admin/orders/new")}>
          Nuovo ordine
        </button>

        <button style={btn} onClick={() => navigate("/admin/products")}>
          Gestione prodotti
        </button>
      </div>
    </div>
  )
}

/* ======================
   STILI INLINE (SAFE)
   ====================== */

const page = {
  padding: 24,
  maxWidth: 480,
  margin: "0 auto",
  color: "#fff",
  textAlign: "center",
}

const title = {
  color: "#d4af37",
  marginBottom: 24,
}

const grid = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
}

const btn = {
  padding: "14px 16px",
  fontSize: 16,
  fontWeight: 600,
  borderRadius: 12,
  border: "none",
  background: "#1a1a1a",
  color: "#fff",
}