import { json } from 'express';
import express from 'express';
import usuario from '../controllers/usuario.js';
import chat from '../controllers/chat.js';
import { upload, uploadFile } from '../controllers/upload.js';
import cors from 'cors';
import retrieveInfo from '../controllers/retrieveInfo.js';
import recuperasenha from '../controllers/recuperasenha.js';

//import configurePassport from '../config/passport.js';

const app = express();

app.use(cors());
app.use(json());

app.use(express.json());

app.get('/teste', (req, res) => {
  console.log('bateu');
  return res.send('Hello, World!');
});

// Endpoint para validar login
app.get('/usuario',(req,res) => usuario.validarLogin(req,res));
//Endpoint para cadastrar usuario
app.post('/usuario',(req,res) => usuario.cadastrarUsuario(req,res));
//Endpoint para pegar os generos cadastrados
app.get('/genres',(req,res) => retrieveInfo.getGenres(req,res));
//Endpoint para criar sala
app.post('/room',(req,res)=> chat.createRoom(req,res));
//Endpoint para retornar os usuarios
app.get('/user_room',(req,res)=> chat.return_user(req,res));
//Endpoint para retornar as salas de um usuario
app.get('/rooms',(req,res)=> chat.rooms_user(req,res));
//Endpoint de arquivos
app.post('/upload', upload, uploadFile);
// Rota de upload de arquivos
//app.post();
app.post('/recuperasenha', (req, res) => recuperasenha.recuperarSenha(req, res));
// Endpoint para atualizar senha
app.post('/update_senha', (req, res) => recuperasenha.update_senha(req, res));

app.get('/users', (req, res) => usuario.getUsers(req, res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});