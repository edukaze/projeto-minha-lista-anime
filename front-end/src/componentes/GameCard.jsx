import React from "react";

/**Componente GameCard
 * @param {Object} jogo - Objeto com os dados do jogo (id, titulo, imagem)
 * @param {Function} onClick - Função que será chamada ao clicar (setJogoSelecionado)
 */
function GameCard({ jogo, onClick }) {
  return (
    <article
      className="jogo-card"
      key={jogo.id}
      onClick={() => onClick(jogo)}
    >
      <img
        src={
          jogo.imagem ||
          "https://via.placeholder.com/120x160?text=Sem+Imagem"
        }
        alt={jogo.titulo}
        className="jogo-imagem"
        // Caso a URL da imagem no banco de dados falhe (link quebrado)
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/120x160?text=Erro+Imagem";
        }}
      />
      <h2 className="titulo-mini">{jogo.titulo}</h2>
    </article>
  );
}

export default GameCard;