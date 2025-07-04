'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [showSobreText, setShowSobreText] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function deslogar() {
    console.log('Deslogando...');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('email');
    window.location.href = '/Login';
  }

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50">
      <div className="px-4 py-2 flex items-center justify-between">
        {/* Logo (Esquerda) */}
        <div className="flex items-center space-x-2">
          <Image src="/LOGO-GUIAIA.png" alt="Icone Guia-Ia" width={42} height={39} />
          <span className="text-xl font-semibold">Guia IA</span>
        </div>

        {/* Itens do Menu (Centralizado) */}
        <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex items-center justify-center`}>
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 md:flex-row md:space-x-6 md:mt-0">
            <li>
              <Link href="#" className="block py-2 px-3 text-blue-400 hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <button
                className="block py-2 px-3 hover:text-blue-400"
                onClick={() => setShowSobreText(true)}
              >
                Sobre
              </button>
            </li>
          </ul>
        </div>

        {/* Modal Sobre */}
        {showSobreText && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                onClick={() => setShowSobreText(false)}
                aria-label="Fechar"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-2">Sobre o Guia-IA</h2>
              <p className="mb-2">
                O <span className="font-semibold text-blue-400">Guia-IA</span> é uma ferramenta desenvolvida para auxiliar usuários a tirar dúvidas e compreender melhor arquivos enviados para a Inteligência Artificial.
              </p>
              <p className="mb-2">
                Nosso objetivo é tornar o uso da IA mais acessível, fornecendo explicações claras e suporte para diferentes tipos de arquivos.
              </p>
              <p className="mb-2">
                Esta ferramenta foi criada por Wellinton, Eduardo, Paulo e Bruno, alunos da <span className="font-semibold">UFFS</span>.
              </p>
              <p>
                Conte conosco para facilitar sua experiência com IA!
              </p>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                onClick={() => window.location.href = 'http://localhost:3000/Dashboard'}
              >
                Home
              </button>
            </div>
          </div>
        )}

        {/* Dropdown do Usuário e Botão Mobile (Direita) */}
        <div className="flex items-center space-x-3">
          {/* Botão Dropdown */}
          <button
            type="button"
            className="flex text-sm bg-gray-700 rounded-full focus:ring-2 focus:ring-white"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          >
            <span className="sr-only">Open user menu</span>
            <Image src="/file.svg" alt="User photo" width={32} height={32} className="w-8 h-8 rounded-full" />
          </button>

          {/* Botão Menu Mobile */}
          <button
            type="button"
            onClick={() => setMenuOpen(!isMenuOpen)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-gray-700 focus:outline-none"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>

        {/* Dropdown do Usuário */}
        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="z-50 absolute top-14 right-4 my-0.5 text-base list-none bg-gray-700 divide-y divide-gray-600 rounded-lg shadow-lg"
          >
            <div className="px-4 py-3">
              {(() => {
                let user = 'Não encontrado';
                let email = 'Não encontrado';
                if (typeof window !== 'undefined') {
                  const usuarioStr = localStorage.getItem('usuario');
                  if (usuarioStr) {
                    try {
                      const usuarioObj = JSON.parse(usuarioStr);
                      user = usuarioObj.username || usuarioObj.nome || 'Não encontrado';
                      email = usuarioObj.email || localStorage.getItem('email') || 'Não encontrado';
                    } catch {
                      user = usuarioStr;
                      email = localStorage.getItem('email') || 'Não encontrado';
                    }
                  } else {
                    user = 'Não encontrado';
                    email = localStorage.getItem('email') || 'Não encontrado';
                  }
                }
                return (
                  <>
                    <span className="block text-sm text-white">{user}</span>
                    <span className="block text-sm text-gray-400 truncate">{email}</span>
                  </>
                );
              })()}
            </div>
            <ul className="py-2">
              <li>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                  onClick={() => {router.push('/Dashboard'); setDropdownOpen(false);}}
                >
                  Dashboard
                </button>
              <li>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                  onClick={() => {router.push('/CriarSala'); setDropdownOpen(false);}}
                >
                  Criar Sala
                </button>
              </li>
              </li>
              <li>
                <Link 
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                  onClick={() => {
                    deslogar();
                  }}
                >
                  Fazer Logout
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}