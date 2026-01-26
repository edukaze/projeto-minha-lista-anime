import "../estilos/Perfil.css";
import React, { useEffect, useState } from "react";
import { listarStatus, salvarStatusGame, excluirStatusGame } from "../services/statusService";

const Perfil = () => {
  const [jogosComStatus, setJogosComStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  // ESTADO PARA MINIMIZAR: Controla a visibilidade de cada categoria
  const [secoesAbertas, setSecoesAbertas] = useState({
    jogando: true,
    zerado: true,
    dropado: true
  });
  
  const [menuAberto, setMenuAberto] = useState(null);

  // Fecha ou abre o menu de 3 pontos de um jogo específico
  const mudaMenu = (gameId) => {
    setMenuAberto(menuAberto === gameId ? null : gameId);
  };

  // Alterna entre aba aberta e fechada
  const mudaSecao = (categoria) => {
    setSecoesAbertas(prev => ({
      ...prev,
      [categoria]: !prev[categoria]
    }));
  };

  const carregarDadosPerfil = async () => {
    try {
      const statusData = await listarStatus();
      setJogosComStatus(statusData);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  // FUNÇÃO CORRIGIDA: Agora ela realmente exclui e atualiza a interface
  const jogoPerfilExcluir = async (gameId) => {
    if (window.confirm("Deseja remover este jogo da sua lista?")) {
      try {
        await excluirStatusGame(gameId); // Chama o service para deletar no banco
        setMenuAberto(null); // Fecha o menu
        carregarDadosPerfil(); // Recarrega a lista para sumir o card
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Não foi possível excluir o jogo.");
      }
    }
  };

  useEffect(() => {
    carregarDadosPerfil();
  }, []);

  const handleMudarStatus = async (game_id, novoStatus) => {
    try {
      await salvarStatusGame(game_id, novoStatus);
      carregarDadosPerfil(); // Atualiza a lista para o jogo mudar de categoria
    } catch (error) {
      alert("Erro ao atualizar status");
    }
  };

  if (loading) return <p className="loading-text">Carregando sua coleção...</p>;

  return (
    <div className="perfil-container">
      <h1>Meu Perfil Gamer</h1>

      <div className="status-sections">
        {['jogando', 'zerado', 'dropado'].map((categoria) => (
          <section key={categoria} className={secoesAbertas[categoria] ? "aberta" : "minimizada"}>
            
            <div className="secao-header" onClick={() => mudaSecao(categoria)}>
              <h2 className={`titulo-${categoria}`}>
                {categoria.toUpperCase()}
              </h2>
              <span className="seta-icone">
                {secoesAbertas[categoria] ? "▲" : "▼"}
              </span>
            </div>

            {secoesAbertas[categoria] && (
              <div className="jogos-grid">
                {jogosComStatus
                  .filter((j) => j.status === categoria)
                  .map((jogo) => (
                    <div key={jogo.game_id} className="card-perfil">
                      
                      <div className="card-header">
                        <img src={jogo.imagem} alt={jogo.titulo} />
                        
                        <div className="opcoes-container">
                          <button className="opcoes-btn" onClick={() => mudaMenu(jogo.game_id)}>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                          </button>

                          {menuAberto === jogo.game_id && (
                            <div className="dropdown-menu">
                              <button onClick={() => alert("Abrir modal de avaliação")}>
                                ⭐ Avaliar
                              </button>
                              {/* CHAMADA CORRIGIDA AQUI */}
                              <button className="btn-excluir" onClick={() => jogoPerfilExcluir(jogo.game_id)}>
                                🗑️ Excluir
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="card-body">
                        <h3>{jogo.titulo}</h3>

                        <div className="status-badge-container">
                          {['jogando', 'zerado', 'dropado'].map((op) => (
                            <button
                              key={op}
                              className={`btn-status-chip ${jogo.status === op ? 'ativo-' + op : ''}`}
                              onClick={() => handleMudarStatus(jogo.game_id, op)}
                            >
                              {op === 'jogando' && '🎮'}
                              {op === 'zerado' && '🏆'}
                              {op === 'dropado' && '❌'}
                              <span className="texto-chip">{op.toUpperCase()}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};

export default Perfil;