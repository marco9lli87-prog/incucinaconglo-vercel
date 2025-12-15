import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export default function Home({ onAdd }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('name')

      if (!error) setProducts(data || [])
      setLoading(false)
    }

    loadProducts()
  }, [])

  return (
    <>
      {/* HEADER */}
      <header className="site-header">
        <img src="/logo.png" alt="In Cucina con Glò" />
      </header>

      {/* HERO */}
      <section className="hero">
        <h1>
          Pasta fresca<br />
          fatta a mano
        </h1>
        <p>
          Ordina online.<br />
          Ritiro o consegna concordata.
        </p>
      </section>

      {/* PRODOTTI */}
      <section className="products">
        {loading && <p className="loading">Caricamento…</p>}

        {!loading &&
          products.map(product => (
            <div key={product.id} className="product-card">
              <img
                src={product.image_url}
                alt={product.name}
              />

              <h3>{product.name}</h3>

              <span className="price">
                € {product.price.toFixed(2)}
              </span>

              <button onClick={() => onAdd(product)}>
                Aggiungi
              </button>
            </div>
          ))}
      </section>
    </>
  )
}