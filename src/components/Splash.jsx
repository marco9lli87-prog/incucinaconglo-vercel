import { useEffect } from 'react'

export default function Splash({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('seenSplash', 'true')
      onFinish()
    }, 4000)

    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <div
      onClick={onFinish}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
    >
      <div style={{ textAlign: 'center' }}>
        {/* FRUSTA */}
        <img
          src="/frusta.png"
          alt=""
          className="splash-frusta"
        />

        {/* TESTO */}
        <h1
          style={{
            marginTop: '1.25rem',
            color: '#d4af37',
            fontFamily: 'Cinzel, serif',
            letterSpacing: '0.15em',
            fontSize: '1.1rem'
          }}
        >
          IN CUCINA CON GLÒ
        </h1>
      </div>
    </div>
  )
}