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
      <div className="splash-logo-wrapper">
        {/* LOGO COMPLETO STATICO */}
        <img
          src="/logo.png"
          alt="In Cucina con Glò"
          className="splash-logo"
        />

        {/* FRUSTA ANIMATA SOPRA */}
        <img
          src="/frusta.png"
          alt=""
          className="splash-frusta-overlay"
        />
      </div>
    </div>
  )
}