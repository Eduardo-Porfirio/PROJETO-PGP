'use client';
import React, { useState } from "react";
import SidebarHist from "@/Components/sidebarhist";
import StickNav from "@/Components/sticknavbar";
import Chat from "@/Components/chat";

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
    const [messages, setMessages] = useState<Message[]>(mockMessages);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        const newMessage: Message = {
            id: messages.length + 1,
            user: "You",
            content: input,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages([...messages, newMessage]);
        setInput("");
    };

    return (
        <main className="flex flex-col bg-white h-screen">
            <StickNav />
            {/* Barra de Navegação Fixa */}
            <div className=" flex-1 grid md:grid-cols-[280px_1fr] gap-2 p-2 bg-white ">
                <SidebarHist />
                <Chat />
            </div>
        </main>
    );
}