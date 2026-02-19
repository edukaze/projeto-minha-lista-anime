import "../estilos/Comunidade.css";
import React, { useEffect, useState } from "react";
import { buscaFeedComunidade } from "../services/comunidadeService";

function Comunidade(){

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
      <h1>Resenhas da Comunidade</h1>
      
      <div className="feed-lista">
        {avaliacoes.length > 0 ? (
          avaliacoes.map((post, index) => (
            
            <div key={index} className="post-comunidade">
              <header>
                <strong>{post.usuario_nome}</strong> avaliou:
              </header>
              
              <div className="post-corpo">
                <h4>{post.jogo_titulo}</h4>
                <div className="nota">⭐ {post.nota}/5</div>
               
                <p>"{post.descricao || "Sem comentário..."}"</p>
              </div>
            </div>
          ))
        ) : ( 
          <p>comunidade esta em silencio</p>
        )}
      </div>
    </div>
  );

}

export default Comunidade;