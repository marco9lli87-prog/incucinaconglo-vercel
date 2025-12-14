import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

export default function Home({ onAdd }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadedImages, setLoadedImages] = useState({})

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('name')

      setProducts(data || [])
      setLoading(false)
    }

    load()
  }, [])

  const onImageLoad = id => {
    setLoadedImages(prev => ({ ...prev, [id]: true }))
  }

  return (
    <main
      style={{
        padding: '1.5rem',
        maxWidth: 430,
        margin: '0 auto',
        paddingBottom: '7rem'
      }}
    >
      {/* HERO */}
      <section className="hero">
        <h1>IN CUCINA<br />CON GLÒ</h1>
        <p>
          Pasta fresca artigianale<br />
          Ritiro in loco o consegna concordata
        </p>
      </section>

      {loading && <p>Caricamento prodotti…</p>}

      {/* PRODOTTI */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.25rem'
        }}
      >
        {products.map(product => (
          <article
            key={product.id}
            style={{
              background: 'var(--card)',
              borderRadius: 14,
              overflow: 'hidden',
              textAlign: 'center'
            }}
          >
            {/* IMMAGINE */}
            <div className="image-wrapper">

              <img
                src={product.image_url}
                alt={product.name}
                loading="lazy"
                className="product-image"
              />
            </div>

            {/* TESTO */}
            <div style={{ padding: '0.75rem 0.75rem 0.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 500 }}>
                {product.name}
              </h3>

              <p
                style={{
                  color: 'var(--gold)',
                  fontSize: '.9rem',
                  margin: '.25rem 0 .5rem'
                }}
              >
                € {product.price} / kg
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={() => onAdd(product)}
              style={{
                margin: '0.5rem',
                width: 'calc(100% - 1rem)',
                padding: '0.6rem',
                background: 'var(--gold)',
                color: '#111',
                fontWeight: 600,
                border: 'none',
                borderRadius: 8,
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
