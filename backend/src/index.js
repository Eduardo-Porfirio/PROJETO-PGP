import { json } from 'express';
import express from 'express';
import usuario from '../controllers/usuario.js';
import chat from '../controllers/chat.js';
import { upload, uploadFile } from '../controllers/upload.js';
import cors from 'cors';
import retrieveInfo from '../controllers/retrieveInfo.js';
import mensagem from '../controllers/mensagem.js';

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
//Endpoint para mandar mensagem
app.post('/send_message',(req,res)=> mensagem.enviarMensagem(req,res));

app.post('/upload', upload, uploadFile);

app.get('/messages', (req, res) => chat.buscar_mensagens(req, res));

app.get('/usuarioid',(req,res)=> usuario.getUserById(req,res));

app.put('/usuario', (req, res) => usuario.updateUser(req, res));

app.post("/load-file", async (req, res) => {
  const { filename } = req.body;
  const resultado = await mensagem.carregarArquivo(filename);

  console.log("Resultado do carregamento:", resultado);

  if (!resultado.success) {
    return res.status(400).json({ erro: resultado.message });
  }

  res.json({ message: resultado.message });
}); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});