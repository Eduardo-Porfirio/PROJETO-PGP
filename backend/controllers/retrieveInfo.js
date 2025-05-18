import pool from '../banco.js';

async function getGenres(req, res) {
    const query = `
        SELECT id, type AS name
        FROM back.gender
    `; 
    try {
        const result = await pool.query(query);
        const genres = result.rows.map((genre) => ({
            id: genre.id,
            name: genre.name,
        }));
        return res.status(200).json(genres);
        }
    catch (error) {
        console.error('Erro ao buscar gêneros:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}
export default { getGenres };