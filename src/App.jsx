import { useState } from 'react'
import Home from './Home'
import Splash from './components/Splash'

export default function App() {
  const hasSeenSplash = localStorage.getItem('seenSplash')
  const [showSplash, setShowSplash] = useState(!hasSeenSplash)

  const [cart, setCart] = useState([])

  const addToCart = product => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id
            ? { ...i, qty: i.qty + 1 }
            : i
        )
      }
      return [...prev, { product, qty: 1 }]
    })
  }

  const decreaseQty = productId => {
    setCart(prev =>
      prev
        .map(i =>
          i.product.id === productId
            ? { ...i, qty: i.qty - 1 }
            : i
        )
        .filter(i => i.qty > 0)
    )
  }

  const total = cart.reduce(
    (sum, i) => sum + i.product.price * i.qty,
    0
  )

  const itemsCount = cart.reduce((sum, i) => sum + i.qty, 0)

  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} />
  }

  return (
    <>
      <Home onAdd={addToCart} />

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
            🛒 {itemsCount} articoli · € {total.toFixed(2)}
          </strong>

          <div style={{ marginTop: '.75rem' }}>
            {cart.map(item => (
              <div
                key={item.product.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '.5rem',
                  fontSize: '.9rem'
                }}
              >
                <span>{item.product.name}</span>

                <div style={{ display: 'flex', gap: '.5rem' }}>
                  <button onClick={() => decreaseQty(item.product.id)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => addToCart(item.product)}>+</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}