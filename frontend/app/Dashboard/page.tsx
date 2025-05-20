export default function name() {
    return (
        <main className="min-h-screen flex flex-col bg-white">  
            <div className="w-full h-10 bg-black"></div>
            <div className="w-full h-2 bg-blue-600"></div>

            <div className="flex-1 flex justify-center items-center px-5">
                <div className="Container flex justify-center items-center flex-col">
                    <div className="bg-amber-200 w-full h-16 flex justify-center items-center">
                        <h2 className="font-bold font-serif text-lg">DASHBOARD</h2>
                    </div>

                    <div className="bg-blue-700 h-96 p-5 w-200 max-w-full flex flex-col items-center gap-2">
                        {/* Add your dashboard content here */}
                    </div>
                </div>
            </div>
        </main>
    )
}