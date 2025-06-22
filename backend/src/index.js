import { json } from 'express';
import express from 'express';
import usuario from '../controllers/usuario.js';
import chat from '../controllers/chat.js';
import cors from 'cors';
import retrieveInfo from '../controllers/retrieveInfo.js';

//import configurePassport from '../config/passport.js';

const app = express();

app.use(cors());
app.use(json());

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



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});