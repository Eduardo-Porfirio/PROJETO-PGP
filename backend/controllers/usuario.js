
import { hash as _hash, compare } from 'bcrypt';
const saltRounds = 10;
import pool from '../banco.js';
import jwt from "jsonwebtoken";
const secret = process.env.SECRET_KEY || 'seu_segredo_aqui';

function formatarDataParaSQL(dataBr) {
  console.log("Data recebida:", dataBr);
  if (/^\d{4}-\d{2}-\d{2}$/.test(dataBr)) { // Se já estiver no formato YYYY-MM-DD, apenas retorne
    return dataBr;
  }
  const [dia, mes, ano] = dataBr.split('/');
  return `${ano}-${mes}-${dia}`;
}

async function verificarSenha(senha, hash) {
  const confere = await compare(senha, hash);
  return confere;
}


async function validarLogin(req, res, next) {
  const { email, senha } = req.body;
  console.log("Email:", email);
  console.log("Senha:", senha);
  try {
    const result = await pool.query('SELECT * FROM back.user WHERE email = $1', [email]);
    console.log(result.rows);
    if (result.rows.length === 0) {
      return res.status(401).json({ erro: 'Email não encontrado' });
    }

    const usuario = result.rows[0];

    const senhaCorreta = await compare(senha, usuario.password);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      secret,
      { expiresIn: '1h' }
    );
    return res.status(200).json({
      mensagem: 'Login válido',
      token: token,
      usuario: {
        id: usuario.id,
        email: usuario.email
      }
    });
  } catch (erro) {
    console.error('Erro ao validar login:', erro);
    return res.status(500).json({ erro: 'Erro interno no servidor' });
  }
}

async function cadastrarUsuario(req, res) {
  console.log(req.body);
  console.log("TO AQUI");
  if (req.body.senha !== req.body.confirmarSenha) {
    console.log('Senhas não conferem');
    return res.status(400).json({ erro: 'Por Favor escreva novamente a senha' });
  }
  const usuarioExistente = await pool.query('SELECT * FROM back.user WHERE email = $1', [req.body.email]);
  if (usuarioExistente.rows.length > 0) {
    return res.status(400).json({ erro: 'Email já cadastrado' });
  }
  const usuarioExistente2 = await pool.query('SELECT * FROM back.user WHERE cpf_user = $1', [req.body.cpf]);
  if (usuarioExistente2.rows.length > 0) {
    return res.status(400).json({ erro: 'CPF já cadastrado' });
  }
  const hash = await _hash(req.body.senha, saltRounds);

  const nascimentoSql = formatarDataParaSQL(req.body.dataNascimento);

  if (req.body)

    try {
      const result = await pool.query('INSERT INTO back.user(name_user,cellphone,email,password,gender,cpf_user,date_born)values($1,$2,$3,$4,$5,$6,$7);',
        [req.body.nome, req.body.telefone, req.body.email, hash, req.body.genero, req.body.cpf, nascimentoSql]
      );
      res.status(200).json({ "Status": "Sucesso" });
    } catch (err) {
      console.error('Erro ao cadastrar usuários:', err);
      res.status(500).json({ erro: 'Erro no servidor' });
    }

}


export default { validarLogin, cadastrarUsuario, verificarSenha };