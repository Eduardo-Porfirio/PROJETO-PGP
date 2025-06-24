
import { hash as _hash, compare } from 'bcrypt';
const saltRounds = 10;
import pool from '../banco.js';
import jwt from "jsonwebtoken";
const secret = process.env.SECRET_KEY || 'seu_segredo_aqui';
import iduser from './chat.js';

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


async function validarLogin(req, res) {
  // Pegando os parâmetros da query string (req.query) enviados pelo axios.get
  const email = req.query.email;
  const senha = req.query.senha;

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

    console.log(senhaCorreta);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }
    const token = jwt.sign(
      { id: usuario.id_user, email: usuario.email },
      secret,
      { expiresIn: '1h' }
    );
    return res.status(200).json({
      mensagem: 'Login válido',
      token: token,
      usuario: {
        username: usuario.name_user,
        id: usuario.id_user,
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
        [req.body.nome, req.body.celular, req.body.email, hash, req.body.genero, req.body.cpf, nascimentoSql]
      );
      res.status(200).json({ "Status": "Sucesso" });
    } catch (err) {
      console.error('Erro ao cadastrar usuários:', err);
      res.status(500).json({ erro: 'Erro no servidor' });
    }

  }

async function getUsers(req, res) {  
  try {
    const result = await pool.query('SELECT id_user, name_user, email FROM back.user');
    const usuarios = result.rows.map((usuario) => ({
      id: usuario.id_user,
      nome: usuario.name_user,
      email: usuario.email
    }));
    return res.status(200).json(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

async function getUserById(req, res) {
  const { id } = await iduser.id_user_token(req.query.token);
  console.log(`Buscando usuário com ID: ${id}`);
  
  try {
    const result = await pool.query('SELECT id_user, name_user, email,cellphone FROM back.user WHERE id_user = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    const usuario = {
      id: result.rows[0].id_user,
      nome: result.rows[0].name_user,
      email: result.rows[0].email,
      celular: result.rows[0].cellphone
    };

    return res.status(200).json(usuario);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

async function updateUser(req, res) {
  const { id } = await iduser.id_user_token(req.body.token);
  const { nome, email } = req.body; // Obtém os campos a serem atualizados do corpo da requisição
  console.log(`Atualizando usuário com ID: ${id}`);
  try {
    // Verifica se o usuário existe
    const userCheck = await pool.query('SELECT id_user FROM back.user WHERE id_user = $1', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    // Atualiza os campos fornecidos
    const result = await pool.query(
      'UPDATE back.user SET name_user = COALESCE($1, name_user), email = COALESCE($2, email) WHERE id_user = $3 RETURNING id_user, name_user, email',
      [nome, email, id]
    );

    const usuarioAtualizado = {
      id: result.rows[0].id_user,
      nome: result.rows[0].name_user,
      email: result.rows[0].email
    };

    return res.status(200).json({ mensagem: 'Usuário atualizado com sucesso', usuario: usuarioAtualizado });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}


export default { validarLogin, cadastrarUsuario, verificarSenha, getUsers,getUserById,updateUser};