import { IoSend } from "react-icons/io5";
import { useState } from "react";

type Message = {
    user: string;
    content: string;
    timestamp: string;
};

interface ChatProps {
    messages: Message[];
    input: string;
    setInput: (text: string) => void;
    onSend: () => void;
}

export default function Chat({ messages, input, setInput, onSend }: ChatProps) {

    return (
        <div className="bg-white shadow-2xl p-4 rounded-2xl h-screen overflow-hidden flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Chat Room</h2>
            {/* Use flex-1 e min-h-0 para o container de mensagens */}
            <div className="flex-1 min-h-0 overflow-y-auto bg-gray-50 p-4 rounded-md shadow-inner">
                {messages.length === 0 ? (
                    <p className="text-gray-500 text-center">Envie uma mensagem para iniciar</p>
                ) : (
                    <ul className="space-y-2">
                        {messages.map((message, index) => (
                            <li key={index} className="p-2 bg-gray-100 rounded-md">
                                <div className="font-semibold">{message.user}</div>
                                <div>{message.content}</div>
                                <div className="text-xs text-gray-500">{message.timestamp}</div>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="flex items-center p-2 rounded-md border border-gray-300 bg-gray-100">
                    <input
                        type="text"
                        placeholder="Escreva sua mensagem..."
                        className="flex-1 w-full bg-transparent px-2 py-1 focus:outline-none"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 flex items-center"
                    >
                        <IoSend className="inline-block mr-2" />
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}