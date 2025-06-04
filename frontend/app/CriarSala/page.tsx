import StickNavbar from "@/Components/sticknavbar";

export default function CriarSala() {
    return (
        <main className="min-h-screen flex flex-col bg-white">
            <StickNavbar />
            <div className="flex-1 flex justify-center items-center px-5 bg-blue-200 p-5">
                <div className="Container flex justify-center items-center flex-col bg-white w-full h-screen rounded-2xl shadow-lg p-2">
                    <div className="h-full bg-amber-600 rounded-2xl flex">
                        <h2 className="font-bold font-serif text-lg">CRIAÇÃO DE SALA</h2>
                    </div>
                </div>
            </div>
        </main>
    );
}