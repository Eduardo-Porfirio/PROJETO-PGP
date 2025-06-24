import pool from '../banco.js';
import { hash as _hash, compare } from 'bcrypt';
const saltRounds = 10;

function generate_code() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 10; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}
async function recuperarSenha(req, res) {
    const { email } = req.body;
    console.log('Recuperar senha para o email:', email);
    if (!email) {
        return res.status(400).json({ error: 'Email é obrigatório' });
    }

    const code = generate_code();
    console.log('Código gerado:', code);
    const query = `
        UPDATE back.user
        SET code = $1
        WHERE email = $2
    `;

    try {
        const result = await pool.query(query, [code, email]);
        if (result.rowCount === 0) {
            console.log(result);
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        console.log('Código atualizado no banco de dados');
        console.log('Código enviado para o usuário:', code);
        return res.status(200).json({ message: 'Código de recuperação enviado com sucesso', code });
    } catch (error) {
        console.error('Erro ao recuperar senha:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

const update_senha = async (req, res) => {
    console.log('Atualizando senha...');
    console.log('Dados recebidos:', req.body);
    const email = req.body.email;
    const code = req.body.codigo;
    const newPassword = req.body.senha;
    console.log('Atualizar senha para o email:', email);
    console.log('Código recebido:', code);
    console.log('Nova senha recebida:', newPassword);
    const hash = await _hash(req.body.senha, saltRounds);
    if (!email || !code || !newPassword) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const query = `
        UPDATE back.user
        SET password = $1, code = NULL
        WHERE email = $2 AND code = $3
    `;

    try {
        const result = await pool.query(query, [hash, email, code]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Código inválido ou usuário não encontrado' });
        }
        return res.status(200).json({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar senha:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export default {
    recuperarSenha,
    update_senha
};