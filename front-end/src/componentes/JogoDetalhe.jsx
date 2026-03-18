import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { buscaDetalhesJogo } from "../services/comunidadeService";
import StatusJogos from "./StatusJogos";
import { salvarStatusGame, listarStatus, excluirStatusGame } from "../services/statusService";
import "../estilos/JogoDetalhe.css";

function JogoDetalhes() {
    const { id } = useParams();
    const [jogo, setJogo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [usuarioLogado, setUsuarioLogado] = useState(true);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                setLoading(true);
                const dadosJogo = await buscaDetalhesJogo(id);
                
                let statusDoBanco = null;
                let logado = false;

                try {
                    const listaDeStatus = await listarStatus();
                    // Importante: garantir que o ID seja comparado corretamente (Number com Number)
                    const statusEncontrado = listaDeStatus.find(s => s.game_id === parseInt(id));
                    
                    if (statusEncontrado) {
                        statusDoBanco = statusEncontrado.status;
                    }
                    logado = true; 
                } catch (e) {
                    console.log("Acesso como visitante ou erro na listagem.");
                    logado = false;
                    statusDoBanco = null;
                }

                setJogo({ 
                    ...dadosJogo, 
                    status_usuario: statusDoBanco 
                });
                setUsuarioLogado(logado);

            } catch (error) {
                console.error("Erro crítico ao carregar detalhes do jogo:", error);
            } finally {
                setLoading(false);
            }
        };

        carregarDados();
    }, [id]);

    const onMarcaStatus = async (gameId, statusClicado) => {
        try {
            const statusExistente = jogo.status_usuario === statusClicado;
            
            if (statusExistente) {
                await excluirStatusGame(gameId);
                setJogo(prev => ({ ...prev, status_usuario: null }));
            } else {
                await salvarStatusGame(gameId, statusClicado);
                setJogo(prev => ({ ...prev, status_usuario: statusClicado }));
            }
        } catch (error) {
            console.error("Erro ao marcar o status do jogo:", error);
        }
    };

    if (loading) return <div className="loading-state">Carregando detalhes do jogo...</div>;
    if (!jogo) return <div className="error-state">Jogo não encontrado.</div>;

    return (
        <div className="detalhes-container">
            <button className="btn-voltar" onClick={() => window.history.back()}>← Voltar</button>
            
            <header className="jogo-header">
                <img src={jogo.imagem} alt={jogo.titulo} className="capa-jogo" />

                <div className="info-principal">
                    <h1>{jogo.titulo}</h1>
                    <div className="info-extra-grid">
                        <div className="info-item"><b>Gênero</b> <span>{jogo.genero}</span></div>
                        <div className="info-item"><b>Plataforma</b> <span>{jogo.plataforma}</span></div>
                        <div className="info-item"><b>Ano</b> <span>{jogo.ano}</span></div>
                        <div className="info-item"><b>Estúdio</b> <span>{jogo.desenvolvedora}</span></div>
                    </div>

                    {/* Componente de Status - Prop corrigida para statusDoJogo */}
                    <StatusJogos 
                        statusDoJogo={jogo.status_usuario}
                        id_jogo={jogo.id}
                        usuarioLogado={usuarioLogado}
                        onMarcaStatus={onMarcaStatus}
                    />

                    <div className="nota-geral">Média: ⭐ {jogo.mediaNota}/5</div>
                </div>
            </header>

            <section className="lista-resenhas-especificas">
                <h2>O que os gamers estão dizendo</h2>
                
                {jogo.avaliacoes && jogo.avaliacoes.length > 0 ? (
                    <div className="carrossel-container">
                        <div className="carrossel-track">
                            {jogo.avaliacoes.map((av, index) => (
                                <div key={index} className="resenha-card">
                                    <div className="resenha-topo">
                                        <strong>{av.usuario_nome}</strong>
                                        <span className="nota-tag">&#9733; {av.nota}/5</span>
                                    </div>
                                    <p className="resenha-texto">{av.descricao}</p>
                                </div>
                            ))}
                        </div>
                        <div className="scroll-hint">Deslize para o lado para ver mais →</div>
                    </div>
                ) : (
                    <p className="sem-resenha">Nenhuma avaliação disponível para este jogo.</p>
                )}
            </section>
        </div>
    );
}

export default JogoDetalhes;