import "../estilos/Perfil.css";
import React, { useEffect, useState } from "react";
import { listarStatus, salvarStatusGame, excluirStatusGame } from "../services/statusService";
import BarraBusca from "../componentes/BarraBusca";
import { useNavigate } from "react-router-dom";
import { estaLogado } from "../services/auth";
import ModalConfirmacao from "../componentes/ModalConfirmacao";
import ModalAvaliacao from "../componentes/ModalAvaliacao";
import { salvarAvaliacao } from "../services/avaliacaoServise";
import { Calendar, Gamepad2, Trophy, XCircle, Star, NotebookPen } from 'lucide-react';

const Perfil = () => {
  const [jogosComStatus, setJogosComStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [menuAberto, setMenuAberto] = useState(null);
  const navigate = useNavigate();

  // --- VERIFICAÇÃO DE SEGURANÇA E CARREGAMENTO INICIAL ---
  useEffect(() => {
    if (!estaLogado()) {
      // Se não houver token/sessão, manda para o login
      navigate("/login"); 
      return;
    }

    // Se estiver logado, carrega os dados normalmente
    carregarDadosPerfil();
  }, [navigate]);

  // aba de avaliação 
  const [jogoSendoAvaliado, setJogoSendoAvaliado] = useState(null);

  // ESTADO PARA MINIMIZAR: Controla a visibilidade de cada categoria
  const [secoesAbertas, setSecoesAbertas] = useState({
    jogando: true,
    zerado: true,
    dropado: true, 
    planejado: true
  });

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

  const [confirmacaoExclusao, setConfirmacaoExclusao] = useState({ visivel: false, jogoId: null });

  // Mude sua função jogoPerfilExcluir para apenas abrir o modal
  const abrirConfirmacaoExcluir = (gameId) => {
    setConfirmacaoExclusao({ visivel: true, jogoId: gameId });
    setMenuAberto(null); // Fecha o menu de 3 pontos
  }; 
  
  // Função que realmente exclui
  const confirmarEExcluir = async () => {
    const gameId = confirmacaoExclusao.jogoId;
    try {
      await excluirStatusGame(gameId);
      setMensagemFeedback("Jogo removido da sua biblioteca.");
      setTimeout(() => setMensagemFeedback(null), 3000);
      carregarDadosPerfil();
    } catch (error) {
      console.error("Erro ao excluir:", error);
      setMensagemFeedback("Erro ao excluir o jogo.");
    } finally {
      setConfirmacaoExclusao({ visivel: false, jogoId: null });
    }
  };

  const handleMudarStatus = async (game_id, novoStatus) => {
    try {
      await salvarStatusGame(game_id, novoStatus);
      carregarDadosPerfil(); // Atualiza a lista para o jogo mudar de categoria
    } catch (error) {
      alert("Erro ao atualizar status");
    }
  };

  //avaliações 
  const [mensagemFeedback, setMensagemFeedback] = useState(null);

  const handleSalvarNota = async (gameId, nota, comentario) => {
    try {
      await salvarAvaliacao(gameId, nota, comentario);

      // Define a mensagem de sucesso
      setMensagemFeedback("Avaliação feita com sucesso! Veja Todas sua Resenhas em Minhas Renhas.");
      setTimeout(() => setMensagemFeedback(null), 5000);

      setJogoSendoAvaliado(null); // Fecha o modal
      carregarDadosPerfil(); 
    } catch (error) {
      setMensagemFeedback("Erro ao salvar avaliação. Tente novamente.");
      setTimeout(() => setMensagemFeedback(null), 5000);
    }
  };

  if (loading) return <p className="loading-text">Carregando sua coleção...</p>;

  return (
    <div className="perfil-container">
      <header className="perfil-header-topo">
        <h1>Meu Perfil Gamer</h1>


        <div className="perfil-acoes">
          <button 
            className="btn-ir-resenhas" 
            onClick={() => navigate("/minhas-resenhas")}
          >
            <NotebookPen size={18} /> Minhas Resenhas
          </button>
        </div>
      </header>

      {/* barra de pesquisa */}
      <BarraBusca 
        valor={busca} 
        setValor={setBusca} 
        placeholder="Pesquise seus jogos..." 
      />

      {/* Mensagem de Feedback Animada */}
      {mensagemFeedback && (
        <div className="feedback-toast">
          <p>{mensagemFeedback}</p>
        </div>
      )}

      <div className="status-sections">
        {['planejado','jogando', 'zerado', 'dropado'].map((categoria) => (
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
                  .filter((j) => 
                    j.status === categoria && 
                    j.titulo.toLowerCase().includes(busca.toLowerCase())
                  )
                  .map((jogo) => (
                    <div key={jogo.game_id} className="card-perfil">
                      
                      <div className="card-header">
                        <img src={jogo.imagem} alt={jogo.titulo} />
                        
                        {/* pontos flutuantes */}
                        <div className="opcoes-container">
                          <button className="opcoes-btn" onClick={() => mudaMenu(jogo.game_id)}>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                          </button>

                          {menuAberto === jogo.game_id && (
                            <div className="dropdown-menu">
                              <button onClick={() => {
                                setJogoSendoAvaliado(jogo);
                                setMenuAberto(null);
                              }}>
                                <Star size={18} /> Avaliar
                              </button>
                              <button className="btn-excluir" onClick={() => abrirConfirmacaoExcluir(jogo.game_id)}>
                                <XCircle size={18} /> Excluir
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="card-body">
                        <h3>{jogo.titulo}</h3>

                        <div className="status-badge-container">
                          {['planejado','jogando', 'zerado', 'dropado'].map((op) => (
                            <button
                              key={op}
                              className={`btn-status-chip ${jogo.status === op ? 'ativo-' + op : ''}`}
                              onClick={() => handleMudarStatus(jogo.game_id, op)}
                            >
                              {op === 'planejado' && <Calendar size={18} />}
                              {op === 'jogando' && <Gamepad2 size={18} />}
                              {op === 'zerado' && <Trophy size={18} />}
                              {op === 'dropado' && <XCircle size={18} />}
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

      {/* Renderização condicional do modal de avaliação */}
      {jogoSendoAvaliado && (
        <ModalAvaliacao 
          jogo={jogoSendoAvaliado} 
          fecharModal={() => setJogoSendoAvaliado(null)}
          salvarAvaliacao={handleSalvarNota}
        />
      )}
      
      {/* Renderização condicional do modal de confirmação de exclusão */}
      {confirmacaoExclusao.visivel && (
        <ModalConfirmacao 
          mensagem="Deseja realmente remover este jogo da sua lista?"
          aoConfirmar={confirmarEExcluir}
          aoCancelar={() => setConfirmacaoExclusao({ visivel: false, jogoId: null })}
        />
      )}
    </div>
  );
};

export default Perfil;