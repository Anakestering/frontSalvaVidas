import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast"; // Usando o toast que instalamos

export default function Cadastro() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        senha: ""
    });

    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

    // Lógica para detectar senhas diferentes
    const senhasDiferentes = confirmarSenha && form.senha !== confirmarSenha;

    // --- ESSA FUNÇÃO ESTAVA FALTANDO ---
    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    /*-----------------  ENVIO DADOS  -----------------*/

    async function handleSubmit(e) {
        e.preventDefault();

        if (senhasDiferentes) {
            toast.error("As senhas precisam ser iguais!");
            return;
        }

        try {
            const resposta = await fetch("http://localhost:8080/cadastro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            if (!resposta.ok) {
                throw new Error("Erro no cadastro");
            }

            toast.success("Usuário cadastrado com sucesso!");
            navigate("/");

        } catch (err) {
            toast.error("Erro ao realizar o cadastro. Tente novamente.");
            console.error(err);
        }
    }

    /*---------------------  UI  ----------------------*/

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center py-10">
            <div className="w-full max-w-[650px] bg-white rounded-md shadow-md p-10">
                <h1 className="text-3xl font-bold mb-8">Cadastro de Usuário</h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <h2 className="text-xl font-semibold mb-5 border-b pb-2 text-gray-700">
                            Dados de Acesso
                        </h2>

                        <div className="space-y-5">
                            {/* E-MAIL */}
                            <div>
                                <label className="block mb-2 font-medium">E-mail *</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="exemplo@email.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full h-12 border rounded-md px-4 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            {/* SENHA */}
                            <div>
                                <label className="block mb-2 font-medium">Senha *</label>
                                <div className="relative">
                                    <input
                                        type={mostrarSenha ? "text" : "password"}
                                        name="senha"
                                        required
                                        value={form.senha}
                                        onChange={handleChange}
                                        className="w-full h-12 border rounded-md px-4 pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setMostrarSenha(!mostrarSenha)}
                                        className="absolute right-4 top-3 text-gray-500 hover:text-gray-700"
                                    >
                                        {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* CONFIRMAR SENHA */}
                            <div>
                                <label className="block mb-2 font-medium">Confirmar Senha *</label>
                                <div className="relative">
                                    <input
                                        type={mostrarConfirmacao ? "text" : "password"}
                                        value={confirmarSenha}
                                        onChange={(e) => setConfirmarSenha(e.target.value)}
                                        required
                                        className={`w-full h-12 border rounded-md px-4 pr-12 focus:ring-2 outline-none ${
                                            senhasDiferentes ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setMostrarConfirmacao(!mostrarConfirmacao)}
                                        className="absolute right-4 top-3 text-gray-500 hover:text-gray-700"
                                    >
                                        {mostrarConfirmacao ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {senhasDiferentes && (
                                    <p className="text-red-600 text-sm mt-2 font-medium">
                                        As senhas não são iguais
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="flex-1 h-12 border-2 border-gray-400 rounded-md hover:bg-gray-50 transition font-medium"
                        >
                            Voltar
                        </button>

                        <button
                            type="submit"
                            disabled={senhasDiferentes || !form.email || !form.senha}
                            className="flex-1 h-12 bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white rounded-md font-semibold transition"
                        >
                            Finalizar Cadastro
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
