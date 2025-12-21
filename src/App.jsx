import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./Home"

import AdminDashboard from "./pages/AdminDashboard"
import AdminOrders from "./pages/AdminOrders"
import AdminNewOrder from "./pages/AdminNewOrder"
import AdminProducts from "./pages/AdminProducts"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* SITO PUBBLICO */}
        <Route path="/" element={<Home />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/orders/new" element={<AdminNewOrder />} />
        <Route path="/admin/products" element={<AdminProducts />} />
      </Routes>
    </BrowserRouter>
  )
}