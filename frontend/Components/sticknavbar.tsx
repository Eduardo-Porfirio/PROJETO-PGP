'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50">
      <div className="px-4 py-2 flex items-center justify-between">
        {/* Logo (Esquerda) */}
        <div className="flex items-center space-x-2">
          <Image src="/LOGO-GUIAIA.png" alt="Icone Guia-Ia" width={42} height={39} />
          <span className="text-xl font-semibold">Guia IA</span>
        </div>

        {/* Itens do Menu (Centralizado) */}
        <div  className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex items-center justify-center`}>
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 md:flex-row md:space-x-6 md:mt-0">
            <li>
              <Link href="#" className="block py-2 px-3 text-blue-400 hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="#" className="block py-2 px-3 hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="#" className="block py-2 px-3 hover:text-white">
                Services
              </Link>
            </li>
          </ul>
        </div>

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
              <span className="block text-sm text-white">Bonnie Green</span>
              <span className="block text-sm text-gray-400 truncate">name@flowbite.com</span>
            </div>
            <ul className="py-2">
              <li>
                <Link href="#" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">Dashboard</Link>
              </li>
              <li>
                <Link href="#" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">Settings</Link>
              </li>
              <li>
                <Link href="#" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">Earnings</Link>
              </li>
              <li>
                <Link href="#" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">Sign out</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}