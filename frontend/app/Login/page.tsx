'use client';
import React, { useState } from 'react';
import Button from '@/Components/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [step, setStep] = useState<'form' | 'loading'>('form');
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');
    try {
      const response = await axios.get('http://localhost:3001/usuario', {
        params: {
          email,
          senha,
        },
      });
      console.log('recebido:', response.data);
      console.log('status:', response.status);
      if (response.status === 200) {
        console.log('Login realizado com sucesso:', response.data);
        setToast({ show: true, message: 'Login realizado com sucesso!', type: 'success' });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          username: response.data.usuario.username,
          email: response.data.usuario.email,
        }));
        router.replace('/Dashboard');
        setTimeout(() => {
          setToast({ show: false, message: '', type: 'success' });
        }, 2000);
      }
    } catch {
      console.error('Erro ao tentar logar');
      setToast({ show: true, message: 'Erro ao tentar logar.', type: 'error' });
      setStep('form');
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 2000);
    }
  };

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

        {step === 'form' && (
          <form className="space-y-4" onSubmit={handleLogin}>
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
            <div className='flex itens-center justify-between flex-col p-2'>
              <Button type="submit">Fazer Login</Button>
              <button
                type="button"
                className="ml-4 text-blue-700 hover:text-blue-500"
                onClick={() => router.push('/Cadastro')}
              >
                Não tem uma conta? Cadastre-se
              </button>
              <button
                type="button"
                className="ml-4 text-blue-700 hover:text-blue-500"
                onClick={() => router.push('/RecuperarSenha')}
              >
                Esqueci minha senha
              </button>
            </div>
          </form>
        )}

        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center h-40">
            <span className="text-blue-700 text-lg font-semibold">Validando...</span>
          </div>
        )}
      </div>
      <footer className="w-full fixed bottom-0 left-0 bg-blue text-white text-center py-3 shadow-md">
        © {new Date().getFullYear()} Projeto PGP. Todos os direitos reservados.
      </footer>
    </main>
  );
}
