export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Qui in futuro:
  // - leggeremo il carrello
  // - creeremo la sessione Stripe
  // - ritorneremo l'URL di pagamento

  return res.status(200).json({
    message: 'Stripe endpoint pronto (non attivo)'
  })
}
