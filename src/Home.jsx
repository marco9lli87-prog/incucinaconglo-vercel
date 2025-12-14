import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

export default function Home({ onAdd }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('name')

      if (error) setError(error.message)
      else setProducts(data)

      setLoading(false)
    }

    loadProducts()
  }, [])

  return (
    <main style={{ padding: '1.5rem', maxWidth: 1200, margin: '0 auto', paddingBottom: '6rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--gold)', fontSize: '2rem', marginBottom: '.5rem' }}>
          In Cucina con Glò
        </h1>
        <p style={{ color: 'var(--muted)' }}>
          Pasta fresca artigianale, fatta a mano 🍝
        </p>
      </header>

      {loading && <p>Caricamento prodotti…</p>}
      {error && <p style={{ color: 'tomato' }}>{error}</p>}

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {products.map(product => (
          <article
            key={product.id}
            style={{
              background: 'var(--card)',
              borderRadius: 12,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ aspectRatio: '1 / 1', overflow: 'hidden' }}>
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#777'
                  }}
                >
                  Nessuna immagine
                </div>
              )}
            </div>

            <div style={{ padding: '1rem', flexGrow: 1 }}>
              <h3 style={{ marginBottom: '.25rem' }}>{product.name}</h3>
              <p style={{ color: 'var(--gold)', fontWeight: 600 }}>
                € {product.price}
              </p>
            </div>

            <button
              onClick={() => onAdd(product)}
              style={{
                border: 'none',
                padding: '0.75rem',
                background: 'var(--gold)',
                color: '#111',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Aggiungi
            </button>
          </article>
        ))}
      </section>
    </main>
  )
}
