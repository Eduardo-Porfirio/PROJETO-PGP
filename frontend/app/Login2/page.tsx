// app/not-found.tsx
'use client';
import React, { useEffect, useState } from 'react';
import Button from '@/Components/button'; // ajuste o caminho se necessário
import axios from 'axios';
import { compileFunction } from 'vm';

export default function Cadastro() {
  // Estado para controlar o passo atual do formulário
  const [step, setStep] = useState(1);

  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleLogin = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLogin1 = async () => {
    try {
      const response = await axios.post('http://localhost:3000/login', {
        email,
        senha,
      });

      if (response.status === 200) {
        console.log('Login successful:', response.data);
        // Handle successful login (e.g., redirect to another page)
      } else {
        console.error('Login failed:', response.data);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  function handleNextStep(e: React.FormEvent) {
    e.preventDefault();
    setStep(2);
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
          Login
        </h1>

        {step === 1 && (
          <form className="space-y-4" onSubmit={handleNextStep}>
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
            <div className='flex justify-center items-center'>
              <Button type="submit">Fazer Login</Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-4">
            <div className='flex justify-between items-center'>
            </div>
          </form>
        )}
      </div>
      <footer className="w-full fixed bottom-0 left-0 bg-blue text-white text-center py-3 shadow-md">
        © {new Date().getFullYear()} Projeto PGP. Todos os direitos reservados.
      </footer>
    </main>
  );
}
