import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

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

      if (!error) {
        setProducts(data || [])
      }

      setLoading(false)
    }

    loadProducts()
  }, [])

  return (
    <>
      {/* HEADER */}
      <header className="site-header">
  <div className="header-inner">
    <div className="logo-split">
      <img
        src="/logo-icon.png"
        alt=""
        className="logo-icon"
      />
      <span className="logo-text">
        IN CUCINA CON GLÒ
      </span>
    </div>
  </div>
</header>

      {/* HERO */}
      <section className="hero">
        <h1>
          Pasta fresca<br />
          fatta come a casa
        </h1>

        <p>
          Preparata a mano, con ingredienti semplici.<br />
          Ordina oggi e scegli se ritirare o ricevere a casa.
        </p>
      </section>

      {/* PRODOTTI */}
      <section className="products">
        {loading && (
          <p className="loading">Sto preparando il banco…</p>
        )}

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
                Aggiungi al carrello
              </button>
            </div>
          ))}
      </section>
    </>
  )
}