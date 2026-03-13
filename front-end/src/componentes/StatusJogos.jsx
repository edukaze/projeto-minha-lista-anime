import React from "react";

function StatusJogos({ statusDoJogo, id_jogo, usuarioLogado, onMarcaStatus }) {
  
  if (!usuarioLogado) return null;

  const opcoes = [
    { id: "jogando", label: "Jogando" },
    { id: "zerado", label: "Zerado" },
    { id: "dropado", label: "Dropado" },
    { id: "planejado", label: "Quero Jogar" },
  ];

  return (
    <div className="status-container-botoes">
      {opcoes.map((opt) => (
        <button
          key={opt.id}
          // A comparação agora bate com a prop statusDoJogo vinda do pai
          className={`btn-status-item ${statusDoJogo === opt.id ? "ativo" : ""}`}
          onClick={() => onMarcaStatus(id_jogo, opt.id)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default StatusJogos;