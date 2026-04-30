import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleLogin() {
    setErro("");
    setLoading(true);

    try {
        const response = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: usuario, senha }),
        });

        if (!response.ok) {
            setErro("Usuário ou senha inválidos.");
            return;
        }

        const data = await response.json();

        
        localStorage.setItem("token", data.token);
        localStorage.setItem("nivelAcesso", data.tipo);


        if (data.tipo === "ADMIN") {
            navigate("/admin/dashboard");
        } else {
            navigate("/dashboard");
        }

    } catch (err) {
        setErro("Erro ao conectar com o servidor.");
    } finally {
        setLoading(false);
    }
}

    

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="w-[430px] bg-white px-14 py-16 rounded-md">

                <h1 className="text-3xl font-bold text-gray-900 mb-10">
                    Bem-vindo!
                </h1>

                {/* Mensagem de erro */}
                {erro && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {erro}
                    </div>
                )}

                {/* Usuário */}
                <div className="mb-5">
                    <label className="block text-sm text-gray-800 mb-2">
                        Identificação de usuário
                    </label>
                    <input
                        type="text"
                        placeholder="Digite seu usuário"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        className="w-full h-12 border border-gray-400 rounded-sm px-4 focus:outline-none focus:border-blue-600"
                    />
                </div>

                {/* Senha */}
                <div className="mb-6">
                    <label className="block text-sm text-gray-800 mb-2">
                        Senha
                    </label>
                    <input
                        type="password"
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        className="w-full h-12 border border-gray-400 rounded-sm px-4 focus:outline-none focus:border-blue-600"
                    />
                </div>

                {/* Botão login */}
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full h-12 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold rounded-md transition"
                >
                    {loading ? "Entrando..." : "Acessar"}
                </button>

                {/* Links abaixo */}
                <div className="flex justify-between items-center mt-5 text-sm">
                    <button className="text-blue-700 hover:underline" onClick={() => navigate("/restaurarSenha")}>
                        Esqueceu sua senha?
                    </button>
                    <button className="text-blue-700 hover:underline" onClick={() => navigate("/cadastro")}>
                        Não é cadastrado?
                    </button>
                </div>

            </div>
        </div>
    );
}