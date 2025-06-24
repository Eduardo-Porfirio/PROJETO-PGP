import multer from 'multer';
import path from 'path';
import pool from '../banco.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    const arquivosPath = path.resolve(__dirname, '../chat-gpt-api/arquivos');
    cb(null, arquivosPath);
  },
  filename: (_, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Middleware configurado para múltiplos arquivos
const upload = multer({ storage }).array('files', 10); // 'files' é o nome do campo, 10 é o limite máximo de arquivos

// Função de manipulação dos arquivos enviados
const uploadFile = (req, res) => {
  console.log('Arquivos recebidos:', req.files);
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    return res.status(400).send('Nenhum arquivo enviado.');
  }

  const uploadedFiles = req.files.map(file => ({
    filename: file.filename,
    originalname: file.originalname,
    path: `/uploads/${file.filename}`,
    size: file.size,
    mimetype: file.mimetype
  }));

  const query = `INSERT INTO back.archive (file_name, file_path, id_user, id_room) VALUES ($1, $2, $3, $4) RETURNING id_file`;
  const values = uploadedFiles.map(file => [file.filename, file.path, req.body.id_user, req.body.id_room]);
  console.log('Valores a serem inseridos:', values);
  const promises = values.map(value => pool.query(query, value));
  Promise.all(promises)
    .then(results => {
      console.log('Arquivos salvos no banco de dados:', results);
    })
    .catch(error => {
      console.error('Erro ao salvar arquivos no banco de dados:', error);
      return res.status(500).send('Erro ao salvar arquivos no banco de dados.');
    });

  res.status(200).send({
    message: 'Arquivos enviados com sucesso',
    files: uploadedFiles
  });
};

export { upload, uploadFile };
