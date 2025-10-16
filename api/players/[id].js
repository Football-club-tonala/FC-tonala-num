import { db } from '@vercel/postgres';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const { name, number, size } = req.body;
      await db.sql`
        UPDATE players
        SET name = ${name}, number = ${number}, size = ${size}
        WHERE id = ${id};
      `;
      return res.status(200).json({ message: 'Jugador actualizado correctamente.' });
    } catch (error) {
      console.error('Error al actualizar jugador:', error);
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Ese número ya lo usa otro jugador.' });
      }
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await db.sql`DELETE FROM players WHERE id = ${id};`;
      return res.status(200).json({ message: 'Jugador eliminado correctamente.' });
    } catch (error) {
      console.error('Error al eliminar jugador:', error);
      return res.status(500).json({ error: 'Error al eliminar el jugador.' });
    }
  }

  return res.status(405).end();
}
