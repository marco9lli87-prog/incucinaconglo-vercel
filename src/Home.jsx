import { supabase } from './lib/supabase'
import { useEffect, useState } from 'react'

export default function Home() {
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)

      if (error) setError(error.message)
      else setProducts(data)
    }
    load()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#111', color: '#d4af37', padding: '2rem' }}>
      <h1>In Cucina con Glò 🍝</h1>
      <p>Home minimale con Supabase collegato</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
        {products.map(p => (
          <div key={p.id} style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px' }}>
            {p.image_url && (
              <img src={p.image_url} alt={p.name} style={{ width: '100%', borderRadius: '6px' }} />
            )}
            <h3>{p.name}</h3>
            <p>€ {p.price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
