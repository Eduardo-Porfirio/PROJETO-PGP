import React from "react";
import { FaPen } from "react-icons/fa";
import { FaRegFolderOpen } from "react-icons/fa6";

export default function SidebarHist() {
    return (
        <div className="bg-gray-100 shadow-md rounded-lg p-4 w-full row-span-2 min-h-screen grid grid-rows-[100px_1fr]">
            <div className="flex flex-col gap-2 mb-4">
            <button className="w-full font-semibold hover:bg-gray-300 px-2 py-1 rounded-2xl flex items-center gap-2 justify-start">
                <FaPen />
                <span>Nova sala</span>
            </button>
            <button className="w-full font-semibold hover:bg-gray-300 px-2 py-1 rounded-2xl flex items-center gap-2 justify-start">
                <FaRegFolderOpen />
                <span>Arquivadas</span>
            </button>
            </div>
            <h2 className="text-lg font-bold mb-4">Historico de conversas</h2>
        </div>
    );
}