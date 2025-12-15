import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

export default function Home({ onAdd }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('id')

    if (!error) setProducts(data || [])
    setLoading(false)
  }

  return (
    <main className="home">
      {/* HERO */}
      <section className="hero">
        <h1 className="hero-title">
          Pasta fresca fatta a mano, come a casa
        </h1>

        <p className="hero-subtitle">
          Ogni settimana preparo pasta fresca artigianale con ingredienti semplici e tanto amore.
          Scegli cosa vuoi, al resto pensiamo insieme su WhatsApp.
        </p>

        <p className="hero-note">
          Produzione limitata • disponibilità settimanale
        </p>
      </section>

      {/* PRODOTTI */}
      <section className="products">
        {loading && <p>Caricamento…</p>}

        {!loading && products.length === 0 && (
          <p>Nessun prodotto disponibile al momento.</p>
        )}

        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <img
                src={product.image_url}
                alt={`Pasta fresca ${product.name}`}
                className="product-image"
              />

              <div className="product-info">
                <h3 className="product-name">
                  {product.name}
                </h3>

                <p className="product-price">
                  € {product.price.toFixed(2)}
                </p>

                <button
                  className="product-add"
                  onClick={() => onAdd(product)}
                >
                  Aggiungi
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTO DI FIDUCIA */}
      <section className="trust">
        <p className="trust-text">
          Nessun pagamento online.
          Ti contatterò io su WhatsApp per confermare ritiro o consegna.
        </p>
      </section>

      {/* CHIUSURA */}
      <footer className="home-footer">
        <p className="footer-note">
          Sono Glò e cucino come farei per la mia famiglia.
          Pochi piatti, fatti bene, quando è il momento giusto.
        </p>
      </footer>
    </main>
  )
}