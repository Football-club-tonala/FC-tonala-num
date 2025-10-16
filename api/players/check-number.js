import { db } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { number } = req.body;

  try {
    const result = await db.query('SELECT * FROM players WHERE number = $1', [number]);
    if (result.rowCount > 0) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (err) {
    console.error('Error al verificar número:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
