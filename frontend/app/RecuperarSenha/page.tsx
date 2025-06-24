'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

function RecuperarSenha() {
    const [email, setEmail] = useState('');
    const router = useRouter();
    const [codigo, setCodigo] = useState('');
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
    const handleRecuperarSenha = () => {
        try {
            axios.post('http://localhost:3001/recuperasenha', { email })
            .then(response => {
                console.log('Email de recuperação enviado:', response.data);
                if (response.status === 200) {
                    setToast({ show: true, message: `Codigo de recuperacao: ${response.data.code}`, type: 'success' });
                    setTimeout(() => {
                        setToast({ show: false, message: '', type: 'success' });
                    }, 6000);
                } 
            })
            .catch(error => {
                console.error('Erro ao enviar email de recuperação:', error);
                setToast({ show: true, message: 'Erro ao enviar email de recuperação.', type: 'error' });
                setTimeout(() => { 
                    setToast({ show: false, message: '', type: 'success' });
                }, 2000);
            });
        } catch (error) {
            console.error('Error:', error);
            console.log('Erro ao enviar email de recuperação:', error);
        }
        };
    const [senha, setSenha] = useState('');
    const handleConfirmarCodigo = async () => {
        try {
            const response = await axios.post('http://localhost:3001/update_senha', {
                email,
                codigo,
                senha,
            });
            if (response.status === 200) {
                setToast({ show: true, message: 'Senha alterada com sucesso!', type: 'success' });
                setTimeout(() => {
                    setToast({ show: false, message: '', type: 'success' });
                    router.push('/Login');
                }, 2000);
            } else {
                setToast({ show: true, message: 'Falha ao alterar a senha.', type: 'error' });
                setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 2000);
            }
        } catch (error) {
            setToast({ show: true, message: 'Erro ao confirmar código ou alterar senha.', type: 'error' });
            setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 2000);
        }
    };

    return (
        <main className="min-h-screen bg-blue-700 flex items-center justify-center flex-col">
            <form className="space-y-4 bg-white p-8 rounded-lg shadow-md w-full max-w-sm" onSubmit={e => e.preventDefault()}>
                <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Recuperar Senha</h2>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        E-mail
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="seuemail@exemplo.com"
                        required
                    />
                </div>
                <button
                    type="button"
                    className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition-colors font-semibold"
                    onClick={handleRecuperarSenha}
                >
                    Enviar código
                </button>
                <div>
                    <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-1">
                        Código de verificação
                    </label>
                    <input
                        type="text"
                        id="codigo"
                        value={codigo}
                        onChange={e => setCodigo(e.target.value)}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Digite o código recebido"
                    />
                </div>
                <div>
                    <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
                        Nova senha
                    </label>
                    <input
                        type="password"
                        id="senha"
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Digite a nova senha"
                    />
                </div>
                {codigo && senha && (
                    <button
                        type="button"
                        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors font-semibold"
                        onClick={handleConfirmarCodigo}
                    >
                        Confirmar código e trocar senha
                    </button>
                )}
            </form>
            {toast.show && (
                <div
                    className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white ${
                        toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                    }`}
                >
                    {toast.message}
                </div>
            )}
            <footer className="w-full fixed bottom-0 left-0 bg-blue text-white text-center py-3 shadow-md">
                © {new Date().getFullYear()} Projeto PGP. Todos os direitos reservados.
            </footer>
        </main>
    );
}

export default RecuperarSenha;