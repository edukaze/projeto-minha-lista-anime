import React,{useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { buscaDetalhesJogo } from "../services/comunidadeService";
import "../estilos/JogoDetalhe.css";

function JogoDetalhes() {
    const { id } = useParams();
    const [jogo, setJogo] = useState(null);
    const [loading, setLoading] = useState(true);
     
    useEffect(() => {
        const carregarDetalhes = async () => {
            try {
                const resposta = await buscaDetalhesJogo(id);
                
                setJogo(resposta);
               
            } catch (error) {
                console.error("Erro ao carregar detalhes do jogo:", error);
            } finally {
                setLoading(false);
            }
        };
        carregarDetalhes();
    }, [id]);

    if (loading) {
        return <div>Carregando detalhes do jogo...</div>;
    }
    if (!jogo) {
        return <div>Jogo não encontrado.</div>;
    }

    return (
    <div className="detalhes-container">
      <header className="jogo-header">
        <button className="btn-voltar" onClick={() => window.history.back()}>← Voltar</button>
            <img src={jogo.imagem} alt={jogo.titulo} className="capa-jogo" />
        <div className="info-principal">
          <h1>{jogo.titulo}</h1>
          <div className="nota-geral">Média: ⭐ {jogo.mediaNota}/5</div>
        </div>
      </header>

      <section className="lista-resenhas-especificas">
        <h2>O que os gamers estão dizendo:</h2>
        {jogo.avaliacoes.map((av, index) => (
          <div key={index} className="resenha-individual">
            <strong>{av.usuario_nome}</strong>
            <span>Nota: {av.nota}/5</span>
            <p>{av.descricao}</p>
            {/* botões de likes mais tarde */}
          </div>
        ))}
      </section>
    </div>
  );
}

export default JogoDetalhes;