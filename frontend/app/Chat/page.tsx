'use client';
import React, { useState } from "react";
import SidebarHist from "@/Components/sidebarhist";
import StickNav from "@/Components/sticknavbar";
import Chat from "@/Components/chat";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
interface Message {
    id: number;
    user: string;
    content: string;
    timestamp: string;
}

const mockMessages: Message[] = [
    { id: 1, user: "Alice", content: "Hello!", timestamp: "10:00" },
    { id: 2, user: "Bob", content: "Hi Alice!", timestamp: "10:01" },
];


export default function ChatRoom() {
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

    const handleSend = () => {
        if (!input.trim()) return;

        const newMessage: Message = {
            id: messages.length + 1,
            user: "Você",
            content: input,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };

        setMessages([...messages, newMessage]);
        setInput("");
    };

    const [messages, setMessages] = useState<Message[]>(mockMessages);
    const [input, setInput] = useState("");
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/Login");
        } else {
            RecuperaMensagem();
        }
    }, []);
    const RecuperaMensagem = async () => {
        const token = localStorage.getItem("token");
        const id_room = "1"; // substitua pelo id correto da sala
        console.log("Cheguei aqui!");

        try {
            console.log("Entrei no try");
            const response = await axios.get('http://localhost:3001/messages', {
                params: {
                    id_room,
                    token
                }
            });

            console.log("Requisicao:", response);
            if (response.data.Status === "Sucesso") {
                // Mapeia as mensagens para o tipo Message
                const loadedMessages: Message[] = response.data.Messages.map((msg: any) => ({
                    id: msg.id_message,
                    user: msg.name_user,
                    content: msg.message_text,
                    timestamp: new Date(msg.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                }));
                setMessages(loadedMessages);
            }
        } catch (error) {
            console.error("Erro ao buscar mensagens:", error);
        }
    };

    return (
        <main className="flex flex-col bg-white h-screen">
            <StickNav />
            {/* Barra de Navegação Fixa */}
            <div className=" flex-1 grid md:grid-cols-[280px_1fr] gap-2 p-2 bg-white ">
                <SidebarHist />
                <Chat
                    messages={messages}
                    input={input}
                    setInput={setInput}
                    onSend={handleSend}
                />
            </div>
        </main>
    );
}