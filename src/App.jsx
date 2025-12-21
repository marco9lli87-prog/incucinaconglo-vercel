import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./Home"
import AdminDashboard from "./pages/AdminDashboard"

/* Placeholder temporanei */
function AdminOrders() {
  return <div style={{ color: "#fff", padding: 24 }}>Admin ordini</div>
}

function AdminNewOrder() {
  return <div style={{ color: "#fff", padding: 24 }}>Nuovo ordine</div>
}

function AdminProducts() {
  return <div style={{ color: "#fff", padding: 24 }}>Admin prodotti</div>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/orders/new" element={<AdminNewOrder />} />
        <Route path="/admin/products" element={<AdminProducts />} />
      </Routes>
    </BrowserRouter>
  )
}