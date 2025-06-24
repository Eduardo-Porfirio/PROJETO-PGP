'use client';
import React from "react";
import StickNav from "@/Components/sticknavbar";
import Button from "@/Components/button";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useEffect } from 'react';
import Router from "next/router";

export default function CadastroSala() {
    const router = useRouter();
    const REQUIRE_AUTH = true; // Altere para false para desabilitar proteção
    useEffect(() => {
        if (REQUIRE_AUTH) {
            const token = localStorage.getItem("token");
            if (!token) {
                router.replace("/Login");
            }
        }
    }, []);

    const [users, setUsers] = React.useState<User[]>([]);

    const [name_room, setNomeSala] = React.useState('');
    const [description, setDescricaoSala] = React.useState('');
    const [user, setUsuariosSala] = React.useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = React.useState<string[]>([]);

    interface User {
        id: number;
        name: string;
        email: string;
        createdAt: string;
    }
/*
    React.useEffect(() => {
        axios.get('http://localhost:3001/user_room')
            .then(response => {
                const responseData = response.data;
                if (!Array.isArray(responseData)) {
                    console.error('Dados recebidos não são um array:', responseData);
                    alert('Erro ao buscar usuários. Tente novamente.');
                    return;
                }
                console.log('Usuários recebidos:', responseData);
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar usuários:', error);
                alert('Erro ao buscar usuários. Tente novamente.');
            });
    }, []);
*/
    const handleUploadFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        console.log('Arquivos selecionados:', files);
        if (files && files.length > 0) {
            const formData = new FormData();
            Array.from(files).forEach(file => {
                formData.append('files', file);
            });
            try {
                const response = await axios.post('http://localhost:3001/upload_files', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('Arquivos enviados com sucesso:', response.data);
                alert('Arquivos enviados com sucesso!');
            } catch (error) {
                console.error('Erro ao enviar arquivos:', error);
                alert('Erro ao enviar arquivos. Tente novamente.');
                return [];
            }
        }
    };
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // Adicione a linha abaixo se você precisa obter o token de algum lugar, por exemplo do localStorage:
        const token = localStorage.getItem('token') || '';

        //const filePaths = await handleUploadFiles(event as React.ChangeEvent<HTMLInputElement>);

        // Obtém o input de arquivos
        const inputFile = document.querySelector('input[type="file"]') as HTMLInputElement | null;
        console.log('Input de arquivo:', inputFile);
        let filePaths: string[] = [];
        if (inputFile && inputFile.files && inputFile.files.length > 0) {
            const formData = new FormData();
            Array.from(inputFile.files).forEach(file => {
                formData.append('files', file);
            });
            try {
                // Envia os arquivos para o backend (rota /upload_files)
                const uploadResponse = await axios.post('http://localhost:3001/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                // Espera que o backend retorne os caminhos dos arquivos
                filePaths = uploadResponse.data.filePaths || [];
            } catch (error) {
                console.error('Erro ao enviar arquivos:', error);
                alert('Erro ao enviar arquivos. Tente novamente.');
                return;
            }
        }

        console.log('Caminhos dos arquivos enviados:', filePaths);
        const payload = {
            name_room,
            description,
            token, // Incluindo o token no payload
            user: user.map(id => ({ id_user: Number(id) })), // Convertendo os IDs de usuário para números
            files: filePaths
        };
        console.log('Enviando para o backend:', payload); // <-- Aqui imprime o que será enviado
        try {
            console.log(payload)
            const response = await axios.post('http://localhost:3001/room', payload);
            console.log(response.data);
            if (response.status === 200) {
                alert('Sala criada com sucesso!');
                console.log("Sala:", response.data.Id_room)
                router.push(`/Chat/${response.data.Id_room}`); // Redireciona para a sala criada
            } else {
                alert('Erro ao criar sala. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao criar sala:', error);
            alert('Erro ao criar sala. Tente novamente.');
        }
    };

    // Busca usuários para seleção na criação da sala
    React.useEffect(() => {
        axios.get('http://localhost:3001/user_room')
            .then(response => {
                const responseData = response.data;
                // Se o backend retorna { lista: [...] }
                const usersArray = Array.isArray(responseData)
                    ? responseData
                    : Array.isArray(responseData.lista)
                        ? responseData.lista
                        : [];
                if (!Array.isArray(usersArray)) {
                    console.error('Dados recebidos não são um array:', responseData);
                    alert('Erro ao buscar usuários. Tente novamente.');
                    return;
                }
                // Ajusta para o formato esperado pelo componente
                const formattedUsers = usersArray.map((u: any) => ({
                    id: Number(u.id_user),
                    name: u.name_user,
                    email: u.email || '',
                    createdAt: u.createdAt || ''
                }));
                setUsers(formattedUsers);
            })
            .catch(error => {
                console.error('Erro ao buscar usuários:', error);
                alert('Erro ao buscar usuários. Tente novamente.');
            });
    }, []);
    return (
        <main>
            <StickNav />
            {/* Barra de Navegação Fixa */}
            <form onSubmit={handleSubmit}>
                <div className="min-h-screen grid grid-rows-1 md:grid-rows-2 md:grid-cols-[1fr_2fr] gap-2 p-2 bg-white">
                    {/* DIV A: Linha 1, Coluna 1 */}
                    <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center shadow-md">
                        <h2 className="text-xl font-bold text-black">Faça uploads dos seus arquivos</h2>
                        <label className="flex flex-col items-center cursor-pointer">
                            <MdOutlineDriveFolderUpload className="text-4xl mb-2" />
                            <span className="text-gray-700 mb-2">Selecionar arquivo</span>
                            <input
                                type="file"
                                className="hidden"
                                multiple
                                onChange={(e) => {
                                    const files = e.target.files;
                                    if (files && files.length > 0) {
                                        const fileNames = Array.from(files).map(file => file.name);
                                        setSelectedFiles(fileNames);
                                        console.log('Arquivos selecionados:', fileNames.join(', '));
                                        alert(`${files.length} arquivo(s) selecionado(s)`);
                                    } else {
                                        setSelectedFiles([]);
                                    }
                                }}
                            />
                        </label>
                        {/* Exibe os nomes dos arquivos selecionados */}
                        {selectedFiles && selectedFiles.length > 0 && (
                            <ul>
                                {selectedFiles.map((name: string, idx: number) => (
                                    <li key={idx}>{name}</li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* DIV B: Linha 2, Coluna 1 */}
                    <div className="bg-gray-100 rounded-lg p-4 row-span-2 flex flex-col gap-4 shadow-md">
                        <div>
                            <h2 className="text-xl font-bold text-black">Criacao de Sala</h2>
                        </div>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Digite o nome da sala"
                            id="name_room"
                            value={name_room}
                            onChange={e => setNomeSala(e.target.value)}
                        />
                        <div>
                            <label className="block text-black font-semibold mb-2" htmlFor="user">
                                Selecione os usuários
                            </label>
                            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md p-2 bg-white">
                                {users.length === 0 ? (
                                    <>
                                        {["Usuário Teste 1", "Usuário Teste 2", "Usuário Teste 3"].map((name, idx) => {
                                            const value = (idx + 1).toString();
                                            return (
                                                <label key={value} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        value={value}
                                                        checked={user.includes(value)}
                                                        onChange={e => {
                                                            if (e.target.checked) {
                                                                setUsuariosSala([...user, value]);
                                                            } else {
                                                                setUsuariosSala(user.filter(u => u !== value));
                                                            }
                                                        }}
                                                        className="accent-blue-600"
                                                    />
                                                    <span>{name}</span>
                                                </label>
                                            );
                                        })}
                                    </>
                                ) : (
                                    Array.isArray(users) && users.map(u => {
                                        const value = u.id.toString();
                                        return (
                                            <label key={u.id} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    value={value}
                                                    checked={user.includes(value)}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            setUsuariosSala(prev =>
                                                                [...prev.filter(v => v !== value), value]
                                                            );
                                                        } else {
                                                            setUsuariosSala(prev =>
                                                                prev.filter((selectedUser: string) => selectedUser !== value)
                                                            );
                                                        }
                                                    }}
                                                    className="accent-blue-600"
                                                />
                                                <span>{u.name} ({u.email})</span>
                                            </label>
                                        );
                                    })
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Marque os usuários que participarão da sala.
                            </p>
                        </div>
                        <textarea
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Digite a descrição da sala"
                            rows={3}
                            id="description"
                            value={description}
                            onChange={e => setDescricaoSala(e.target.value)}
                        ></textarea>
                        <div className="flex gap-2 mt-4">
                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
                            >
                                Criar Sala
                            </Button>
                            <Button
                                type="button"
                                className="bg-red-600 hover:bg-gray-300 text-white font-bold py-2 px-4 rounded"
                                onClick={() => router.push('/Dashboard')}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </div>

                    <div className="bg-gray-100 rounded-lg p-4 row-span-1 shadow-md flex flex-col items-center justify-center">
                        <h2 className="text-xl font-bold text-black">Escolha a atuacao da IA</h2>
                        <p className="text-black"></p>
                    </div>
                </div>
            </form>
        </main>
    );
}