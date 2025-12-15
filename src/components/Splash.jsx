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
      {/* LOGO WRAPPER */}
      <div className="splash-logo-wrapper">
        {/* FRUSTA */}
        <img
          src="/frusta.png"
          alt=""
          className="splash-frusta"
        />

        {/* TESTO LOGO */}
        <h1 className="splash-logo-text">
          IN CUCINA CON GLÒ
        </h1>
      </div>
    </div>
  )
}