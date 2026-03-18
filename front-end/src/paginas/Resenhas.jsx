import React, { useEffect, useState } from "react";
// Import correto usando desestruturação do arquivo correto
import { buscarAvaliacoesUsuario, salvarAvaliacao, apagarAvaliacao } from "../services/avaliacaoServise";
import CardResenha from "../componentes/CardResenhas";
import ModalAvaliacao from "../componentes/ModalAvaliacao";
import { useNavigate } from "react-router-dom";
import ModalConfirmacao from "../componentes/ModalConfirmacao";
import "../estilos/Resenhas.css";
import BarraBusca from "../componentes/BarraBusca";

const MinhasResenhas = () => {
  const [resenhas, setResenhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  
  // Estados para os Modais
  const [jogoSendoEditado, setJogoSendoEditado] = useState(null);
  const [confirmacaoExclusao, setConfirmacaoExclusao] = useState({ visivel: false, id_jogo: null });

  const carregarResenhas = async () => {
    try {
      setLoading(true);
      // CHAMADA DIRETA: Removido o "JogosService."
      const dados = await buscarAvaliacoesUsuario();
      console.log("Resenhas carregadas: ", dados);
      setResenhas(dados);
    } catch (error) {
      console.error("Erro ao carregar resenhas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarResenhas();
  }, []);

  // Função para salvar a edição (chamada pelo ModalAvaliacao)
  const handleSalvarEdicao = async (id_jogo, nota, descricao) => {
    try {
      // CHAMADA DIRETA: Removido o "JogosService."
      await salvarAvaliacao(id_jogo, nota, descricao);
      setJogoSendoEditado(null); // Fecha o modal
      carregarResenhas(); 
    } catch (error) {
      alert("Erro ao atualizar avaliação");
    }
  };

  // Função para excluir (chamada pelo ModalConfirmacao)
  const handleExcluir = async () => {
    try {
      // CHAMADA DIRETA: Removido o "JogosService."
      await apagarAvaliacao(confirmacaoExclusao.id_jogo);
      setConfirmacaoExclusao({ visivel: false, id_jogo: null });
      carregarResenhas();
    } catch (error) {
      alert("Erro ao excluir avaliação");
    }
  };

  if (loading) return <div className="loading">Carregando suas críticas...</div>;

  return (
    <div className="minhas-resenhas-page">
      <header className="header-resenha-top">
      <h1>Minhas Resenhas</h1>

        <div className="acoes-resenha">
            <button 
            className="btn-ir-perfil"
            onClick={() => navigate("/perfil")}>
              Meu Perfil
            </button>
        </div>
      </header>

          <BarraBusca
          valor={busca}
          setValor={setBusca}
          placeholder="Pesquise por um Jogo que Você fez Resenha"
          />

      <div className="resenhas-lista">
        {resenhas.length === 0 ? (
          <p>Você ainda não escreveu nenhuma resenha.</p>
        ) : (
          resenhas.filter((r) => r.titulo.toLowerCase().includes(busca.toLowerCase())
        )
          .map((resenha) => (
            <CardResenha
              key={resenha.id_jogo}
              resenha={resenha}
            
              aoEditar={(r) => setJogoSendoEditado({
                game_id: r.id_jogo, // O modal espera game_id
                titulo: r.titulo,
                nota: r.nota,
                descricao: r.descricao
              })}
              aoExcluir={(id) => setConfirmacaoExclusao({ visivel: true, id_jogo: id })}
            />
          ))
        )}
      </div>

      {/* Modal de Edição */}
      {jogoSendoEditado && (
        <ModalAvaliacao
          jogo={jogoSendoEditado}
          fecharModal={() => setJogoSendoEditado(null)}
          salvarAvaliacao={handleSalvarEdicao}
        />
      )}

      {/* Modal de Confirmação de Exclusão */}
      {confirmacaoExclusao.visivel && (
        <ModalConfirmacao
          mensagem="Tem certeza que deseja apagar esta resenha permanentemente?"
          aoConfirmar={handleExcluir}
          aoCancelar={() => setConfirmacaoExclusao({ visivel: false, id_jogo: null })}
        />
      )}
    </div>
  );
};

export default MinhasResenhas;