import { useEffect, useMemo, useRef, useState } from "react"
import { supabase } from "./lib/supabase"
import Checkout from "./components/Checkout"

function LoaderOverlay({ loading }) {
  const messages = useMemo(
    () => [
      "Impasto a mano…",
      "Stendo la sfoglia…",
      "Taglio con cura…",
      "Preparo il menù…",
      "Quasi pronto…",
    ],
    []
  )

  const [msgIndex, setMsgIndex] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    // reset
    setMsgIndex(0)

    if (!loading) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    // cambia micro-testo
    timerRef.current = setInterval(() => {
      setMsgIndex(i => (i + 1) % messages.length)
    }, 650)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [loading, messages.length])

  return (
    <div className="loader-overlay" role="status" aria-live="polite">
      <div className="loader-card">
        <div className="loader-brand animated-in">
          <img src="/logo-icon.png" className="loader-icon" alt="" />
          <img
            src="/logo-text.png"
            className="loader-text"
            alt="In Cucina con Glò"
          />
        </div>

        <div className="loader-ring animated-in-delay" />

        {/* micro-testo con piccola transizione */}
        <div key={msgIndex} className="loader-sub animated-in-delay2">
          {messages[msgIndex]}
        </div>

        <div className="loader-glowline animated-in-delay3" />
      </div>
    </div>
  )
}

export default function Home() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [showCheckout, setShowCheckout] = useState(false)

  // DATI CLIENTE
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [notes, setNotes] = useState("")

  // LOADING / ERROR
  const [loading, setLoading] = useState(true)
  const [loaderVisible, setLoaderVisible] = useState(true) // per fade-out
  const [loadError, setLoadError] = useState("")

  /* =========================
     LOAD PRODUCTS
     ========================= */

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    setLoaderVisible(true)
    setLoadError("")

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Errore fetch products:", error)
      setLoadError("Non riesco a caricare il menù. Riprova tra poco.")
      setProducts([])
      setLoading(false)

      // anche in errore, fai uscire il loader con stile
      setTimeout(() => setLoaderVisible(false), 450)
      return
    }

    setProducts(data || [])
    setLoading(false)

    // fade-out elegante
    setTimeout(() => setLoaderVisible(false), 450)
  }

  /* =========================
     CART LOGIC
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
          price: Number(product.price),
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

  /* =========================
     CONFIRM ORDER
     ========================= */

  const handleConfirmOrder = async () => {
    if (!customerName || !customerPhone) {
      alert("Inserisci nome e numero WhatsApp")
      return
    }

    if (!cart.length) return

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    // 1. ORDINE
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: customerName,
        customer_phone: customerPhone,
        note: notes,
        total,
        status: "nuovo",
      })
      .select()
      .single()

    if (orderError) {
      console.error(orderError)
      alert("Errore nell’invio dell’ordine")
      return
    }

    // 2. RIGHE ORDINE
    const items = cart.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(items)

    if (itemsError) {
      console.error(itemsError)
      alert("Errore nel salvataggio dei prodotti")
      return
    }

    // 3. RESET
    setCart([])
    setCustomerName("")
    setCustomerPhone("")
    setNotes("")
    setShowCheckout(false)

    alert("Ordine inviato! Ti contatterò a breve su WhatsApp 😊")
  }

  /* =========================
     RENDER
     ========================= */

  return (
    <div className="home">
      {/* LOADER overlay + fade */}
      {loaderVisible && (
        <div className={`loader-fade ${loading ? "is-in" : "is-out"}`}>
          <LoaderOverlay loading={loading} />
        </div>
      )}

      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <img src="/logo-icon.png" className="header-logo-icon" alt="" />
          <img
            src="/logo-text.png"
            className="header-logo-text"
            alt="In Cucina con Glò"
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

      {/* ERRORE + RETRY */}
      {loadError && (
        <div className="load-error">
          <p>{loadError}</p>
          <button className="retry-btn" onClick={fetchProducts}>
            Riprova
          </button>
        </div>
      )}

      {/* PRODOTTI */}
      {!loadError && (
        <section className="products">
          <div className="products-grid">
            {products.map((product, i) => (
              <div
                key={product.id}
                className="product-card fade-in"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <img
                  src={product.image_url}
                  className="product-image"
                  alt={product.name}
                  loading="lazy"
                />

                <div className="product-info">
                  <div className="product-name">{product.name}</div>

                  <div className="product-price">
                    € {Number(product.price).toFixed(2)}
                    {product.unit ? ` / ${product.unit}` : ""}
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
      )}

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
          customerName={customerName}
          setCustomerName={setCustomerName}
          customerPhone={customerPhone}
          setCustomerPhone={setCustomerPhone}
          notes={notes}
          setNotes={setNotes}
          onIncrease={increaseQty}
          onDecrease={decreaseQty}
          onClose={() => setShowCheckout(false)}
          onConfirm={handleConfirmOrder}
        />
      )}
    </div>
  )
}