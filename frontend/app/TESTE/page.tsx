// app/not-found.tsx
'use client';
import React, { useState } from 'react';
import Button from '@/Components/button'; // ajuste o caminho se necessário
import axios from 'axios';
import { compileFunction } from 'vm';

export default function Cadastro() {
  // Estado para controlar o passo atual do formulário
  const [step, setStep] = useState(1);

  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/usuario', {
        nome,
        email,
        dataNascimento,
        celular,
        username,
        senha,
        confirmarSenha,
        genero
      });
      console.log(response.data);
      if (response.status === 200) {
        setToast({ show: true, message: 'Cadastro realizado com sucesso!', type: 'success' });
        setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
      } else {
        console.log("Entrei aqui");
        const message = (response as any).data?.erro;
        setToast({ show: true, message: message, type: 'error' });
        setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
      }
    } catch (error) {
      console.log('Erro:', error);
      const message = (error as any).response?.data?.erro || 'Erro desconhecido ao realizar o cadastro';
      toast.show = true;
      setToast({ show: true, message: message || 'Erro desconhecido ao realizar o cadastro', type: 'error' });
      setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
    }
  }

  // Campos do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [celular, setCelular] = useState('');
  const [username, setUsername] = useState('');
  const [genero, setGenero] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  function formatarCelular(value: string) {
    const numeros = value.replace(/\D/g, "");
    if (numeros.length <= 2) return `(${numeros}`;
    if (numeros.length <= 3) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    if (numeros.length <= 7)
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 3)} ${numeros.slice(3)}`;
    if (numeros.length <= 11)
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 3)} ${numeros.slice(3, 7)}-${numeros.slice(7)}`;
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 3)} ${numeros.slice(3, 7)}-${numeros.slice(7, 11)}`;
  }

  function handleCelularChange(e: React.ChangeEvent<HTMLInputElement>) {
    const valorFormatado = formatarCelular(e.target.value);
    setCelular(valorFormatado);
  }

  function handleNextStep(e: React.FormEvent) {
    e.preventDefault();
    setStep(2);
  }

  function handleCadastroFinal(e: React.FormEvent) {
    e.preventDefault();
    // Aqui você pode enviar os dados para a API ou fazer outras validações
    alert('Cadastro realizado!');
  }

  return (
    <main className="min-h-screen bg-blue-700 flex items-center justify-center">
      <div>
        {toast.show && (
          <div className={`fixed top-0 right-0 m-4 p-4 rounded-md shadow-lg ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            <p className="text-white">{toast.message}</p>
          </div>
        )}
      </div>
      <div className="bg-white rounded-xl shadow-neutral-400 p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Cadastro
        </h1>

        {step === 1 && (
          <form className="space-y-4" onSubmit={handleNextStep}>
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={e => setNome(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Fulano de tal"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="teste@exemplo.com"
                required
              />
            </div>
            <div>
              <label htmlFor="data" className="block text-sm font-medium text-gray-700">
                Data de nascimento
              </label>
              <input
                type="date"
                id="data"
                name="data"
                value={dataNascimento}
                onChange={e => setDataNascimento(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <input
                type="text"
                id="telefone"
                maxLength={16}
                value={celular}
                onChange={handleCelularChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(99) 9 9999-9999"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Gênero
              </label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="genero"
                    value="masculino"
                    checked={genero === "masculino"}
                    onChange={(e) => setGenero(e.target.value)}
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2">Masculino</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="genero"
                    value="feminino"
                    checked={genero === "feminino"}
                    onChange={(e) => setGenero(e.target.value)}
                    className="form-radio text-pink-500"
                  />
                  <span className="ml-2">Feminino</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="genero"
                    value="outro"
                    checked={genero === "outro"}
                    onChange={(e) => setGenero(e.target.value)}
                    className="form-radio text-purple-500"
                  />
                  <span className="ml-2">Outro</span>
                </label>
              </div>
            </div>
            <div className='flex justify-center items-center'>
              <Button type="submit">Próxima etapa</Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Seu usuário"
                required
              />
            </div>
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                type="password"
                id="senha"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite sua senha"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmarSenha"
                value={confirmarSenha}
                onChange={e => setConfirmarSenha(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirme sua senha"
                required
              />
            </div>
            <div className='flex justify-between items-center'>
              <Button onClick={() => setStep(1)}>Voltar</Button>
              <Button type="submit">Cadastrar</Button>
            </div>
          </form>
        )}
        <div className="flex justify-center items-center bg-gray-200 p-4 rounded-md mt-4">
          <div className="border-t border-gray-100">
            <p className="text-sm text-gray-700 align-middle ">
              Já tem uma conta?{' '}
              <a href="/Login" className="text-blue-600 hover:underline">
                Faça login
              </a>
            </p>
          </div>
        </div>
      </div>
      <footer className="w-full fixed bottom-0 left-0 bg-blue text-white text-center py-3 shadow-md">
        © {new Date().getFullYear()} Projeto PGP. Todos os direitos reservados.
      </footer>
    </main>
  );
}
