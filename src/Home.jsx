import { useEffect, useState } from "react"
import Checkout from "./components/Checkout"
import { supabase } from "./lib/supabase"

export default function Home() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [showCheckout, setShowCheckout] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: true })

    if (!error) setProducts(data)
  }

  /* =========================
     CARRELLO — FIX DEFINITIVO
     ========================= */

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)

      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price), // 👈 QUI ERA IL PROBLEMA
          quantity: 1,
        },
      ]
    })
  }

  const increaseQty = (id) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  const decreaseQty = (id) => {
    setCart(prev =>
      prev
        .map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    )
  }

  /* ========================= */

  return (
    <div className="home">
      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <img
            src="/logo-icon.png"
            alt="In Cucina con Glò"
            className="header-logo-icon"
          />
          <img
            src="/logo-text.png"
            alt="In Cucina con Glò"
            className="header-logo-text"
          />
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <h1 className="hero-title">
          Pasta fresca fatta a mano,<br />come a casa
        </h1>

        <p className="hero-subtitle">
          Ogni settimana preparo pasta fresca artigianale con ingredienti
          semplici e tanto amore. Scegli cosa vuoi, al resto pensiamo insieme
          su WhatsApp.
        </p>

        <p className="hero-note">
          Produzione limitata · disponibilità settimanale
        </p>
      </section>

      {/* PRODOTTI */}
      <section className="products">
        <div className="products-grid">
          {products.map((product, i) => (
            <div
              key={product.id}
              className={`product-card fade-in`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="product-image"
              />

              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-price">
                  € {Number(product.price).toFixed(2)}
                </div>

                <button
                  className="product-add"
                  onClick={() => addToCart(product)}
                >
                  Aggiungi
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CARRELLO */}
      {cart.length > 0 && (
        <button
          className="cart-button"
          onClick={() => setShowCheckout(true)}
        >
          Carrello · {cart.reduce((s, i) => s + i.quantity, 0)}
        </button>
      )}

      {/* CHECKOUT */}
      {showCheckout && (
        <Checkout
          cart={cart}
          onIncrease={increaseQty}
          onDecrease={decreaseQty}
          onClose={() => setShowCheckout(false)}
          onConfirm={() => {}}
        />
      )}
    </div>
  )
}