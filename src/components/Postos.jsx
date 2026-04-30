import { useState, useEffect } from "react";

//melhorar isso ai

const API = "http://localhost:8080/postos";

export function Postos() {
  const [postos, setPostos] = useState([]);
  const [form, setForm] = useState({ nome: "", descricao: "" });
  const [editandoId, setEditandoId] = useState(null);
  const [toast, setToast] = useState({ msg: "", tipo: "", show: false });
  const [status, setStatus] = useState("Conectando ao servidor...");

  useEffect(() => {
    listar();
  }, []);

  function showToast(msg, tipo = "error") {
    setToast({ msg, tipo, show: true });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2800);
  }

  async function listar() {
    try {
      const r = await fetch(API);
      if (!r.ok) throw new Error("Erro " + r.status);
      const data = await r.json();
      setPostos(data);
      setStatus("Postos carregados: " + data.length);
    } catch {
      setStatus("Servidor indisponível — exibindo dados locais");
    }
  }

  async function salvar() {
    if (!form.nome.trim()) {
      showToast("O nome do posto é obrigatório.");
      return;
    }

    const body = { nome: form.nome.trim(), descricao: form.descricao.trim() };
    const isEdit = editandoId !== null;
    const url = isEdit ? `${API}/${editandoId}` : API;
    const method = isEdit ? "PUT" : "POST";

    try {
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error("Erro " + r.status);
      showToast(isEdit ? "Posto atualizado com sucesso!" : "Posto cadastrado com sucesso!", "success");
      limparForm();
      await listar();
    } catch {
      if (isEdit) {
        setPostos((prev) =>
          prev.map((p) => (p.id === editandoId ? { ...p, ...body } : p))
        );
      } else {
        setPostos((prev) => {
          const fakeId = prev.length ? Math.max(...prev.map((x) => x.id)) + 1 : 1;
          return [...prev, { id: fakeId, ...body }];
        });
      }
      showToast("Salvo localmente (servidor indisponível)", "success");
      limparForm();
      setStatus("Modo offline — dados não sincronizados");
    }
  }

  function editar(posto) {
    setEditandoId(posto.id);
    setForm({ nome: posto.nome, descricao: posto.descricao || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remover(posto) {
    if (!window.confirm(`Remover o posto "${posto.nome}"?`)) return;

    try {
      const r = await fetch(`${API}/${posto.id}`, { method: "DELETE" });
      if (!r.ok) throw new Error("Erro " + r.status);
      showToast("Posto removido.", "success");
      await listar();
    } catch {
      setPostos((prev) => prev.filter((p) => p.id !== posto.id));
      showToast("Removido localmente (servidor indisponível)", "success");
      setStatus("Modo offline — dados não sincronizados");
    }
  }

  function limparForm() {
    setEditandoId(null);
    setForm({ nome: "", descricao: "" });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(160deg, #1a1a1a 0%, #2c2c2c 40%, #922B21 100%)" }}>

      {/* Topbar */}
      <div className="flex items-center gap-4 px-8 py-4 border-b-2 border-red-500" style={{ background: "rgba(0,0,0,0.45)" }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-yellow-400" style={{ background: "#C0392B" }}>
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <path d="M16 3 C16 3 8 9 8 16 C8 20.4 11.6 24 16 24 C20.4 24 24 20.4 24 16 C24 9 16 3 16 3Z" fill="#F39C12" />
            <path d="M16 8 C16 8 11 12.5 11 16.5 C11 19.0 13.2 21 16 21 C18.8 21 21 19.0 21 16.5 C21 12.5 16 8 16 8Z" fill="#C0392B" />
            <path d="M16 13 C16 13 13.5 15.2 13.5 17.2 C13.5 18.5 14.6 19.5 16 19.5 C17.4 19.5 18.5 18.5 18.5 17.2 C18.5 15.2 16 13 16 13Z" fill="#F8C471" />
            <rect x="10" y="24" width="12" height="2.5" rx="1" fill="#F39C12" />
            <rect x="12" y="26.5" width="8" height="2" rx="1" fill="#F39C12" />
          </svg>
        </div>
        <div>
          <div className="text-white font-bold text-xl tracking-widest" style={{ fontFamily: "sans-serif" }}>
            Corpo de Bombeiros
          </div>
          <div className="text-xs tracking-widest uppercase" style={{ color: "#F8C471" }}>
            Sistema de Gestão de Postos
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-8">

        {/* Label seção */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#F8C471" }}>
            {editandoId ? `Editando Posto #${editandoId}` : "Cadastro de posto"}
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(243,156,18,0.25)" }} />
        </div>

        {/* Card formulário */}
        <div className="rounded-xl mb-6 shadow-2xl" style={{ background: "rgba(255,255,255,0.97)", borderTop: "3px solid #C0392B", padding: "28px 28px 20px" }}>
          <div className="flex items-center gap-2 font-bold text-lg mb-5" style={{ color: "#922B21" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#922B21" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            {editandoId ? `Editando Posto #${editandoId}` : "Novo Posto"}
          </div>

          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium tracking-widest uppercase text-gray-400">Nome *</label>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Ex: Posto Central"
                maxLength={80}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:border-red-500 bg-gray-50 focus:bg-white"
                style={{ focusRingColor: "#C0392B" }}
              />
              <span className="text-xs text-gray-300">Obrigatório</span>
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs font-medium tracking-widest uppercase text-gray-400">Descrição</label>
              <input
                type="text"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Descrição do posto (opcional)"
                maxLength={200}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:border-red-500 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex gap-3 flex-wrap mt-2">
            <button
              onClick={salvar}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-white font-semibold text-sm transition hover:opacity-90 active:scale-95"
              style={{ background: "#C0392B" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Salvar Posto
            </button>
            {editandoId && (
              <button
                onClick={limparForm}
                className="px-5 py-2 rounded-lg text-sm font-semibold border transition hover:bg-red-50"
                style={{ color: "#C0392B", borderColor: "#C0392B" }}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        {/* Label listagem */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#F8C471" }}>
            Postos cadastrados
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(243,156,18,0.25)" }} />
        </div>

        {/* Card tabela */}
        <div className="rounded-xl shadow-2xl overflow-hidden">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr style={{ background: "#922B21" }}>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-white font-semibold w-16">ID</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-white font-semibold">Nome</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-white font-semibold">Descrição</th>
                <th className="text-right px-4 py-3 text-xs tracking-widest uppercase text-white font-semibold w-36">Ações</th>
              </tr>
            </thead>
            <tbody style={{ background: "rgba(255,255,255,0.97)" }}>
              {postos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-300 text-sm">
                    Nenhum posto cadastrado ainda.
                  </td>
                </tr>
              ) : (
                postos.map((p, i) => (
                  <tr key={p.id} style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}
                    className="hover:bg-red-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="bg-gray-100 text-gray-400 rounded px-2 py-0.5 text-xs font-mono font-semibold">
                        #{p.id}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{p.nome}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs max-w-xs truncate">{p.descricao || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => editar(p)}
                        className="px-3 py-1.5 rounded text-xs font-semibold border transition mr-2 hover:bg-yellow-50"
                        style={{ color: "#F39C12", borderColor: "#F8C471" }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => remover(p)}
                        className="px-3 py-1.5 rounded text-xs font-semibold border border-gray-200 text-gray-400 transition hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex justify-between px-8 py-2 text-xs tracking-widest uppercase border-t" style={{ background: "rgba(0,0,0,0.3)", color: "rgba(255,255,255,0.4)", borderColor: "rgba(255,255,255,0.08)" }}>
        <span>{status}</span>
        <span>localhost:8080</span>
      </div>

      {/* Toast */}
      {toast.show && (
        <div
          className="fixed bottom-7 right-7 px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-2xl z-50 transition-all"
          style={{ background: toast.tipo === "success" ? "#1a7a4a" : "#922B21" }}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}