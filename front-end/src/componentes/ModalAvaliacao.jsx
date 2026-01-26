import React, { useState } from "react";
import "../estilos/modalAvaliacao.css";

const ModalAvaliacao = ({ jogo, fecharModal, salvarAvaliacao }) => {
  const [nota, setNota] = useState(jogo.nota || 0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState(jogo.descricao || ""); // Novo estado para o texto

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="fechar-modal" onClick={fecharModal}>✕</button>
        
        <h2>Avaliar: {jogo.titulo}</h2>
        
        <div className="estrelas-container">
          {[1, 2, 3, 4, 5].map((estrela) => (
            <span
              key={estrela}
              className={`estrela ${estrela <= (hover || nota) ? "ativa" : ""}`}
              onClick={() => setNota(estrela)}
              onMouseEnter={() => setHover(estrela)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </span>
          ))}
        </div>

        {/* Novo campo de texto para a descrição */}
        <div className="comentario-container">
          <label htmlFor="comentario">Sua avaliação (opcional):</label>
          <textarea
            id="comentario"
            placeholder="O que você achou desse jogo? Conte sua experiência..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            maxLength={500}
          />
        </div>

        <button 
          className="btn-salvar-avaliacao" 
          onClick={() => salvarAvaliacao(jogo.game_id, nota, comentario)} // Agora envia nota e comentário
        >
          Confirmar Avaliação
        </button>
      </div>
    </div>
  );
};

export default ModalAvaliacao;