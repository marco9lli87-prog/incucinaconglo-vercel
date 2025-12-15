import { useState } from 'react'
import Home from './Home'
import Checkout from './components/Checkout'

export default function App() {
  const [cart, setCart] = useState([])
  const [showCheckout, setShowCheckout] = useState(false)

  const addToCart = product => {
    setCart(prev => {
      const found = prev.find(p => p.id === product.id)
      if (found) {
        return prev.map(p =>
          p.id === product.id
            ? { ...p, qty: p.qty + 1 }
            : p
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const clearCart = () => setCart([])

  const totalItems = cart.reduce(
    (sum, i) => sum + i.qty,
    0
  )

  return (
    <>
      <Home onAdd={addToCart} />

      {/* BOTTONE CARRELLO */}
      {cart.length > 0 && (
        <button
          className="cart-button"
          onClick={() => setShowCheckout(true)}
        >
          Carrello · {totalItems}
        </button>
      )}

      {/* CHECKOUT BOTTOM SHEET */}
      {showCheckout && (
        <Checkout
          cart={cart}
          onClose={() => setShowCheckout(false)}
          onClear={clearCart}
        />
      )}
    </>
  )
}