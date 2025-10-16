import { db } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { rows } = await db.sql`SELECT * FROM players ORDER BY number ASC;`;
      return res.status(200).json({ players: rows });
    } catch (error) {
      console.error('Error al obtener jugadores:', error);
      return res.status(500).json({ error: 'Error al obtener jugadores.' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, number, size } = req.body;

      if (!name || !number || !size) {
        return res.status(400).json({ error: 'Todos los campos son requeridos.' });
      }

      await db.sql`
        INSERT INTO players (name, number, size)
        VALUES (${name}, ${number}, ${size});
      `;

      return res.status(201).json({ message: 'Jugador registrado correctamente.' });
    } catch (error) {
      console.error('Error al registrar jugador:', error);
      if (error.code === '23505') {
        return res.status(409).json({ error: 'El número de camiseta ya está en uso.' });
      }
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }

  return res.status(405).end(); // Method Not Allowed
}
