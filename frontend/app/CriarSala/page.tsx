import StickNav from "@/Components/sticknavbar";
import Button from "@/Components/button";


export default function CadastroSala() {
    return (
        <main>
            <StickNav />
            {/* Barra de Navegação Fixa */}
       
            <div className="min-h-screen grid grid-rows-1 md:grid-rows-2 md:grid-cols-[1fr_2fr] gap-2 p-2 bg-white">

                {/* DIV A: Linha 1, Coluna 1 */}
                <div className="bg-blue-300 rounded-lg p-4">
                    <h2 className="text-xl font-bold text-white">Div A</h2>
                    <p className="text-white">Metade superior da primeira coluna.</p>
                </div>

                {/* DIV B: Linha 2, Coluna 1 */}
                <div className="bg-gray-500 rounded-lg p-4 row-span-2 flex">
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-white">Div B</h2> 
                    </div>
                    <div className="flex-1 flex gap-2 justify-end items-end">
                        <Button className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded ml-2">
                            Cancelar
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded">
                            Criar Sala
                        </Button>
                    </div>
                </div>
                {/* DIV C (Principal): Coluna 2, expandindo por 2 linhas */}
                <div className="bg-slate-700 rounded-lg p-4 row-span-1">
                    <h2 className="text-xl font-bold text-white">Div C (Principal)</h2>
                    <p className="text-white">Esta div ocupa toda a altura e é mais larga.</p>
                </div>
            </div>
        </main>
    );
}