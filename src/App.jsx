import { useState } from 'react'
import Home from './Home'

export default function App() {
  const [cart, setCart] = useState([])

  const addToCart = product => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)

      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      }

      return [...prev, { product, qty: 1 }]
    })
  }

  const removeFromCart = productId => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  )

  return (
    <>
      <Home onAdd={addToCart} />

      {/* CARRELLO */}
      {cart.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: '#111',
            borderTop: '1px solid #333',
            padding: '1rem'
          }}
        >
          <strong style={{ color: '#d4af37' }}>
            Totale: € {total.toFixed(2)}
          </strong>

          <div style={{ marginTop: '.5rem' }}>
            {cart.map(item => (
              <div
                key={item.product.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '.9rem'
                }}
              >
                <span>
                  {item.product.name} × {item.qty}
                </span>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#d4af37',
                    cursor: 'pointer'
                  }}
                >
                  rimuovi
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
