import express, { json } from 'express';
import usuario from '../controllers/usuario.js';
import cors from 'cors';
import retrieveInfo from '../controllers/retrieveInfo.js';

const app = express();

app.use(cors());
app.use(json());

app.get('/teste', (req, res) => {
  console.log('bateu');
  return res.send('Hello, World!');
});

app.get('/usuario',(req,res) => usuario.validarLogin(req,res));

app.post('/usuario',(req,res) => usuario.cadastrarUsuario(req,res));

app.get('/genres',(req,res) => retrieveInfo.getGenres(req,res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});