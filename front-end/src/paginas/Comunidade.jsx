import "../estilos/Comunidade.css";
import React, { useEffect, useState } from "react";
import { buscaFeedComunidade } from "../services/comunidadeService";
import {useNavigate} from "react-router-dom";

function Comunidade(){
    const navigate = useNavigate();
    const [avaliacoes, setAvaliacoes] = useState([]);

    //carregar dados por paginas 
    useEffect(() => {
        const carregarFeed = async() => {
            try{
                const dados = await buscaFeedComunidade()
                setAvaliacoes(dados);
                
            } catch (error){
                console.error("Error ao carregar a comunidade", error);
            }
        };
        carregarFeed();
    }, []);

   return (
  <div className="comunidade-container">
    <h1>RESENHAS DA COMUNIDADE</h1>
    
    <div className="feed-lista">
  {avaliacoes.map((item, index) => (
    <div 
      key={index} 
      className="card-jogo-comunidade" 
      onClick={() => navigate(`/comunidade/jogo/${item.id_jogo}`)}
    >
      {/* Imagem de fundo do card */}
      <div 
        className="jogo-banner" 
        style={{ backgroundImage: `url(${item.jogo_imagem})` }}
      >
        <div className="media-badge">⭐ {item.media_nota || item.nota}</div>
      </div>

      <div className="card-info">
        <h4>{item.jogo_titulo}</h4>
        <p className="total-txt">{item.total_resenhas} avaliações da comunidade</p>
        
        {/* comunidade: última atividade */}
        <div className="ultima-atividade">
          <span className="user-highlight">{item.ultimo_usuario}:</span>
          <p className="p-comentario">"{item.ultima_descricao || "Sem comentário..."}"</p>
        </div>
      </div>
    </div>
  ))}
</div>
  </div>
);

}

export default Comunidade;