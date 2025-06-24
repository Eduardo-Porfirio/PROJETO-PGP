import { post } from 'axios';
import FormData from 'form-data';
import { createReadStream } from 'fs';
const axios = require('axios');

async function enviarNomeArquivo() {
  const nomeArquivo = 'meuarquivo.txt';

  try {
    const res = await axios.post('http://localhost:8000/ler-arquivo', {
      filename: nomeArquivo
    });

    console.log('Resposta da API:', res.data);
  } catch (err) {
    console.error('Erro ao enviar nome:', err.message);
  }
}

enviarNomeArquivo();

async function fazerPergunta(pergunta) {
    try {
        // Valida se a pergunta é uma string
        if (typeof pergunta !== 'string' || pergunta.trim() === '') {
            throw new Error('A pergunta deve ser uma string não vazia.');
        }

        // Cria o formulário codificado
        const form = new URLSearchParams();
        form.append('question', pergunta);

        // Faz a requisição POST
        const res = await axios.post('http://localhost:8000/ask', form.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        // Exibe a resposta no console
        console.log('Resposta da IA:', res.data.resposta);

        // Retorna a resposta
        return res.data.resposta;
    } catch (error) {
        // Trata erros e exibe no console
        console.error('Erro ao fazer a pergunta:', error.message);
        throw error; // Opcional: relança o erro para ser tratado em outro lugar
    }
}

export default {enviarArquivo,fazerPergunta};