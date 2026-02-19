import React from "react";

// Recebemos os dados e funções via props
function ModalJogo({ 
  jogo, 
  onClose, 
  usuarioLogado, 
  statusJogos, 
  onMarcarStatus 
}) {
  // Se não houver jogo selecionado, não renderiza nada
  if (!jogo) return null;

  return (
    <div className="modal-fundo" onClick={onClose}>
      <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
        <img
          src={jogo.imagem || "https://via.placeholder.com/300x200?text=Sem+Imagem"}
          alt={jogo.titulo}
          className="modal-img"
        />
        <h2>{jogo.titulo}</h2>
        <p>Ano: {jogo.ano}</p>
        <p>Desenvolvedora: {jogo.desenvolvedora}</p>
        <p>Plataforma: {jogo.plataforma}</p>

        <div className="status-botoes">
          {usuarioLogado ? (
            <>
              <button
                className={statusJogos[jogo.id] === "jogando" ? "ativo" : ""}
                onClick={() => onMarcarStatus(jogo.id, "jogando")}
              >
                Jogando
              </button>

              <button
                className={statusJogos[jogo.id] === "zerado" ? "ativo" : ""}
                onClick={() => onMarcarStatus(jogo.id, "zerado")}
              >
                Zerado
              </button>

              <button
                className={statusJogos[jogo.id] === "dropado" ? "ativo" : ""}
                onClick={() => onMarcarStatus(jogo.id, "dropado")}
              >
                Dropado
              </button>
              <button
                className={statusJogos[jogo.id] === "planejado" ? "ativo" : ""}
                onClick={() => onMarcarStatus(jogo.id, "planejado")}>
                Planejado
              </button>
            </>
          ) : (
            <p style={{ marginTop: "10px", color: "var(--texto-secundario)" }}>
              Faça login para marcar o status do jogo
            </p>
          )}
        </div>

        <button className="modal-fechar" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
}

export default ModalJogo;