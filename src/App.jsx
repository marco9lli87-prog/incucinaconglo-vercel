import { useState } from 'react'
import Home from './Home'
import Checkout from './components/Checkout'
import Admin from './components/Admin'

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

  // routing semplice senza librerie
  if (window.location.pathname === '/admin') {
    return <Admin />
  }

  return (
    <>
      <Home onAdd={addToCart} />

      {cart.length > 0 && (
        <button
          className="cart-button"
          onClick={() => setShowCheckout(true)}
        >
          Carrello · {totalItems}
        </button>
      )}

      {showCheckout && (
        <Checkout
          cart={cart}
          setCart={setCart}
          onClose={() => setShowCheckout(false)}
          onClear={clearCart}
        />
      )}
    </>
  )
}