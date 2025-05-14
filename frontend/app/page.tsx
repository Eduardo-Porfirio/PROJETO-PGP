'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para /login ao carregar a página
    router.push('/Login');
  }, [router]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-500 to-blue-700">
      {/* tela em branco com degradê, sem conteúdo */}
    </div>
  );
}