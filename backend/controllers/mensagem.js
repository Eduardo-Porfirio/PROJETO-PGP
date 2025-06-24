import axios from "axios";
import pool from '../banco.js';
import id_user from './chat.js'
import fs from "fs";
import path from 'path';
import {createRequire} from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

import { fileURLToPath } from 'url';

let conteudo_arquivo = "";
// Necessário em ES Modules (com "type": "module")

async function lerArquivo(nomeArquivo) {
  const caminhoCompleto = path.join('/app/chat-gpt-api', 'arquivos', nomeArquivo);

  console.log('Lendo arquivo:', caminhoCompleto); // DEBUG

  if (!fs.existsSync(caminhoCompleto)) {
    console.error('Caminho não encontrado:', caminhoCompleto); // DEBUG
    throw new Error("Arquivo não encontrado");
  }

  if (nomeArquivo.endsWith('.pdf')) {
    const dataBuffer = fs.readFileSync(caminhoCompleto);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } else {
    return fs.readFileSync(caminhoCompleto, 'utf-8');
  }
}


async function carregarArquivo(nomeArquivo) {
  try {
    const texto = await lerArquivo(nomeArquivo);
    conteudo_arquivo = texto;
    return { success: true, message: `Arquivo ${nomeArquivo} carregado com sucesso` };
  } catch (err) {
    return { success: false, message: err.message };
  }
}



async function enviarMensagem(req, res) {
  const { token, id_room, message,nome_arquivo } = req.body;
  const {id} = await id_user.id_user_token(token);

  
  let conteudo_arquivo = "";
  if (nome_arquivo) {
    conteudo_arquivo = await lerArquivo(nome_arquivo); // sua função para ler o arquivo do disco
  }
  console.log("Conteúdo do id_room :", id_room); // DEBUG
  console.log("Conteúdo do id :", id); // DEBUG
  console.log("Conteúdo da mensagem :", message); // DEBUG
  try {
    // Salva a mensagem do usuário
    await pool.query(`
      INSERT INTO back.chat_message (id_room, sender_id, message_text)
      VALUES ($1, $2, $3)
    `, [id_room, id, message]);

    // Busca as últimas 9 mensagens anteriores para contexto
    const { rows: historicoDesc } = await pool.query(`
      SELECT sender_id, message_text
      FROM back.chat_message
      WHERE id_room = $1
      ORDER BY sent_at DESC
      LIMIT 9
    `, [id_room]);

    const historico = historicoDesc.reverse();

    // Monta o array de mensagens para o GPT
    const messages = [];

    if (conteudo_arquivo) {
      messages.push({
        role: "system",
        content: `Considere o seguinte conteúdo para contexto da conversa:\n\n${conteudo_arquivo}`
      });
    }

    historico.forEach(m => {
      messages.push({
        role: m.sender_id === id ? "user" : "assistant",
        content: m.message_text
      });
    });

    messages.push({
      role: "user",
      content: message
    });

    // Envia para API Python
    const response = await axios.post('http://chatgpt:8000/chat', { messages });
    console.log("Resposta da IA:", response.data);
    const respostaIA = response.data.resposta;

    // Salva resposta da IA no banco (sender_id 0 = IA)
    await pool.query(`
      INSERT INTO back.chat_message (id_room, sender_id, message_text)
      VALUES ($1, $2, $3)
    `, [id_room, 2, respostaIA]);

    res.json({ resposta: respostaIA });

  } catch (err) {
    console.error("Erro no chat:", err.message);
    res.status(500).json({ erro: "Erro ao processar a mensagem" });
  }
};




export default { enviarMensagem, carregarArquivo, lerArquivo };
