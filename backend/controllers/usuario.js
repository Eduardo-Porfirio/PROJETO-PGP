
import { hash as _hash, compare } from 'bcrypt';
const saltRounds = 10;
import pool from '../banco.js';

function formatarDataParaSQL(dataBr) {
    const [dia, mes, ano] = dataBr.split('/');
    return `${ano}-${mes}-${dia}`;
}

async function verificarSenha(senha, hash) {
    const confere = await compare(senha, hash);
    return confere;
}
 

async function validarLogin(req, res) {
    const { email, senha } = req.body;
  
    try {
      const result = await pool.query('SELECT * FROM back.user WHERE email = $1', [email]);
  
      if (result.rows.length === 0) {
        return res.status(401).json({ erro: 'Email não encontrado' });
      }
  
      const usuario = result.rows[0];
  
      const senhaCorreta = await compare(senha, usuario.password);
  
      if (!senhaCorreta) {
        return res.status(401).json({ erro: 'Senha incorreta' });
      }
  
      return res.status(200).json({ mensagem: 'Login válido', usuario: usuario.email });
  
    } catch (erro) {
      console.error('Erro ao validar login:', erro);
      return res.status(500).json({ erro: 'Erro interno no servidor' });
    }
  }
  
async function cadastrarUsuario(req, res) {
    console.log(req.body); 
    const hash = await _hash(req.body.senha, saltRounds);

    const nascimentoSql = formatarDataParaSQL(req.body.nascimento);


    try{
        const result = await pool.query('INSERT INTO back.user(name_user,cellphone,email,password,gender,cpf_user,date_born)values($1,$2,$3,$4,$5,$6,$7);',
                                        [req.body.nome,req.body.telefone,req.body.email,hash,req.body.genero,req.body.cpf,nascimentoSql]                                         
        );
        res.status(200).json({"Status" : "Sucesso"});
    }catch (err) {
        console.error('Erro ao cadastrar usuários:', err);
        res.status(500).json({ erro: 'Erro no servidor' });
      }

}


export default { validarLogin, cadastrarUsuario,verificarSenha};