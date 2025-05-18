'use client';

import React, { useState } from 'react';

import axios from 'axios';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [username, setUser] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState(''); 
  const [genero, setGenero] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleLogin = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/Cadastro', {
        email,
        senha,
        username,
        confirmarSenha,
        dataNascimento,
        telefone,
        genero
      });

      console.log(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <div className="w-full h-10 bg-black"></div>
      <div className="w-full h-2 bg-blue-600"></div>

      <div className="flex-1 flex justify-center items-center px-5">
        <div className="Container flex justify-center items-center flex-col">
          <div className="bg-amber-200 w-full h-16 flex justify-center items-center">
            <h2 className="font-bold font-serif text-lg">REGISTAR</h2>
          </div>

          <div className="bg-blue-700 h-96 p-5 w-200 max-w-full flex flex-col items-center gap-2">
            <input 
              type="email"
              placeholder="Email"
              className="input input-primary bg-amber-200 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="username"
              placeholder="Usuario"
              className="input input-primary bg-amber-200 w-full"
              value={username}
              onChange={(e) => setUser(e.target.value)}
            />
            <input
              type="text"
              placeholder="Data de Nascimento"
              className="input input-primary bg-amber-200 w-full"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
            />
            <input
              type="text"
              placeholder='Telefone'
              className="input input-primary bg-amber-200 w-full"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
            <input 
              type="password"
              placeholder="Senha"
              className="input input-primary bg-amber-200 w-full"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <input 
              type="password"
              placeholder="Confirmar Senha"
              className="input input-primary bg-amber-200 w-full"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <button 
              onClick={handleSubmit}
              className="btn btn-primary bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mt-auto"
            >
              Login
            </button>
          </div>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded shadow-lg z-50">
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Senha:</strong> {senha}</p>
        </div>
      )}
    </main>
  );
}
