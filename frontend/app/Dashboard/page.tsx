import StickNav from "@/Components/sticknavbar";

export default function DashboardPage() {
    return (
        <main>
            <StickNav />
            {/* Barra de Navegação Fixa */}
            <div className="min-h-screen bg-gray-100 grid grid-cols-3 md:grid-cols-2 md:grid-rows-2">
                {/* Conteúdo da Página */}
                <div className="grid grid-rows-[auto_1fr]">
                    <div className="h-16 flex items-center justify-center">
                        <h1 className="text-black text-2xl font-bold">Dashboard</h1>
                    </div>
                    <div className="p-4">
                        <p className="text-gray-700">Bem-vindo ao seu painel de controle!</p>
                        {/* Adicione mais conteúdo aqui */}
                    </div>
                    <div className="bg-gray-200 p-4">

                    </div>
                </div>
            </div>
        </main>
    );
}