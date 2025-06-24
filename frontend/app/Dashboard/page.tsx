"use client";
import StickNav from "@/Components/sticknavbar";
import { IoMdChatbubbles } from "react-icons/io";
import React, { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useRouter } from 'next/navigation';
import axios from 'axios';

const REQUIRE_AUTH = true; // Altere para false para desabilitar proteção

export default function DashboardPage() {

    useEffect(() => {
        if (REQUIRE_AUTH) {
            const token = localStorage.getItem("token");
            if (!token) {
                router.replace("/Login");
            }
        }
    }, []);

    const router = useRouter();

    const [salas, setSalas] = useState([]);
    const [arquivos, setArquivos] = useState<string[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [userData, setUserData] = useState({ nome: '', email: '', celular: '' });

    const handleEditProfile = async () => {
        try {
            const token = localStorage.getItem('token'); // Obtém o token do localStorage
            const response = await axios.get('http://localhost:3001/usuarioid', {
                params: { token }, // Envia o token como parâmetro de consulta
            });
            setUserData({
                nome: response.data.nome,
                email: response.data.email,
                celular: response.data.celular, // Adiciona o campo celular
            });
            setShowPopup(true); // Exibe o pop-up
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Erro ao buscar dados do usuário:', error.response || error.message);
            } else {
                console.error('Erro ao buscar dados do usuário:', error);
            }
            alert('Erro ao buscar os dados do usuário. Tente novamente.');
        }
    };

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); // Obtém o token do localStorage
            const response = await axios.put('http://localhost:3001/usuario', {
                token, // Envia o token no corpo
                nome: userData.nome,
                email: userData.email,
                celular: userData.celular, // Adiciona o campo celular
            });
            console.log('Usuário atualizado:', response.data);
            alert('Dados atualizados com sucesso!');
            setShowPopup(false); // Fecha o pop-up após salvar
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Erro ao atualizar dados do usuário:', error.response || error.message);
            } else {
                console.error('Erro ao atualizar dados do usuário:', error);
            }
            alert('Erro ao atualizar os dados. Tente novamente.');
        }
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    // Mock data para o gráfico de barras
    const mockData = [
        { date: "2025-06-20", salas: 2 },
        { date: "2025-06-21", salas: 4 },
        { date: "2025-06-22", salas: 1 },
        { date: "2025-06-23", salas: 5 },
        { date: "2025-06-24", salas: 3 },
    ];
    type RecenteItem = {
        title: string;
        description: string;
        date: string;
    };
    const [recentes, SetRecentes] = useState<RecenteItem[]>([]);
    useEffect(() => {
        // Simulação de chamada a API para obter dados recentes 
        const fetchRecentData = async () => {
            // Aqui você faria a chamada à API para obter os dados recentes
            // Exemplo:
            // const response = await fetch('/api/recentes');
            // const data = await response.json();
            // SetRecentes(data);
        };
        // fetchRecentData(); // Descomente esta linha para realmente buscar os dados
    }, []);
    useEffect(() => {
        fetch('/api/arquivos')
            .then(res => res.json())
            .then(data => setArquivos(data.files || []));
    }, []);
    return (
        <main>
            <StickNav />
            {/* Barra de Navegação Fixa */}
            <div className="min-h-screen bg-gray-100 grid grid-cols-3 md:grid-cols-2 md:grid-rows-2">
                {/* Conteúdo da Página */}
                <div className="flex flex-col items-center justify-center col-span-2">
                    <h2 className="text-center mb-4 text-2xl font-bold p-3">Salas Criadas por Dia</h2>
                    <div className="h-96 flex items-center justify-center w-full">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={mockData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="salas" fill="#3182ce" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-gray-200 p-4 h-full flex justify-center">
                    <div className="w-full bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            <FaUserAlt className="inline-block mr-2" />
                            Area do Usuário
                        </h2>
                        <p className="text-gray-700">Aqui você pode ver suas informações e gerenciar sua conta.</p>
                        <div className="mt-4">
                            <button
                                className="w-full hover:bg-gray-200 text-black font-bold py-2 px-4 rounded-lg shadow focus:outline-none focus:shadow-outline"
                                onClick={handleEditProfile}
                            >
                                <FaPen className="inline-block mr-2" />
                                Editar Perfil
                            </button>
                            <button 
                                className="w-full hover:bg-gray-200 text-black font-bold py-2 px-4 rounded-lg shadow focus:outline-none focus:shadow-outline"
                                onClick={() => router.push('/CriarSala')}
                            >
                                <IoMdChatbubbles className="inline-block mr-2" />
                                Novo chat
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-200 p-4 h-full flex justify-center">
                    <div className="w-full bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            <FaClockRotateLeft className="inline-block mr-2" />    
                            Acesso rapido
                        </h2>
                        <p className="text-gray-700">Veja suas atividades recentes e interações.</p>
                        {recentes.length > 0 ? (
                            <ul className="mt-4 space-y-2">
                                {recentes.map((item, index) => (
                                    <li key={index} className="p-2 bg-gray-100 rounded-md shadow-sm">
                                        <div className="font-semibold">{item.title}</div>
                                        <div className="text-sm text-gray-600">{item.description}</div>
                                        <div className="text-xs text-gray-500">{item.date}</div>
                                    </li>
                                ))} 
                            </ul>
                        ) : (
                            <div className="flex items-center justify-center h-48">
                                <p className="text-gray-500 mt-4">Nenhuma atividade recente.</p>
                            </div>
                        )}
                    </div> 
                </div>
            </div>
            {/* Pop-up */}
            {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Editar Perfil</h2>
                <form onSubmit={handleSaveChanges}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nome</label>
                        <input
                            type="text"
                            value={userData.nome}
                            onChange={e => setUserData({ ...userData, nome: e.target.value })}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={userData.email}
                            onChange={e => setUserData({ ...userData, email: e.target.value })}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Celular</label>
                        <input
                            type="tel"
                            value={userData.celular}
                            onChange={e => setUserData({ ...userData, celular: e.target.value })}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={closePopup}
                            className="mr-2 px-4 py-2 bg-gray-300 rounded-lg"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )}
        </main>
    );
}
