import React, { useEffect, useState, useCallback } from "react";
import JogosService from "../services/JogosService";
import { estaLogado } from "../services/auth";
import "../estilos/jogospage.css";
import { listarStatus, salvarStatusGame } from "../services/statusService";
import BarraBusca from "../componentes/BarraBusca";
import ModalJogo from "../componentes/ModalJogo";
import GameCard from "../componentes/GameCard";

function Jogos() {
  const [jogos, setJogos] = useState([]);
  const [generos, setGeneros] = useState([]); // Novo: armazena gêneros do banco
  const [generoAtivo, setGeneroAtivo] = useState(null); // Novo: gênero selecionado
  const [page, setPage] = useState(1);
  const usuarioLogado = estaLogado();
  const [busca, setBusca] = useState("");
 

  // itens por página dinâmicos conforme a largura da tela
 const calcularItensPorPagina = () => {
  const largura = window.innerWidth;
  let colunas = 2; // Padrão Mobile (Fish Mobile)

  // Segue a mesma lógica dos seus breakpoints do CSS
  if (largura >= 1200) colunas = 6;
  else if (largura >= 992) colunas = 4;
  else if (largura >= 768) colunas = 4;

  const linhasDesejadas = 3; // Quantas linhas de cards você quer ver?
  return colunas * linhasDesejadas;
};
// Novo: estado para controlar quantos itens mostrar por página, baseado na largura da tela
  const [itensPorPagina, setItensPorPagina] = useState(() =>
    // inicializa com base na largura atual
    typeof window !== "undefined" ? calcularItensPorPagina() : 6
  );

  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [jogoSelecionado, setJogoSelecionado] = useState(null);
  const [statusJogos, setStatusJogos] = useState({});



  // --- NOVO: Efeito para carregar os gêneros do banco ---
  useEffect(() => {
    async function carregaFiltros() {
      try {
        const listaGeneros = await JogosService.getGeneros();
        setGeneros(listaGeneros);
      } catch (error) {
        console.log("Erro ao carregar gêneros: ", error);
      }
    }
    carregaFiltros();
  }, []);

  // Recalcula itensPorPagina ao redimensionar.
  // Se mudar, resetamos a página para 1 (evita estar em página > totalPages).
  useEffect(() => {
    function handlerResize() {
      const nova = calcularItensPorPagina();
      setItensPorPagina((atual) => {
        if (atual !== nova) {
          setPage(1); // reinicia na primeira página quando muda a quantidade por página
          return nova;
        }
        return atual;
      });
    }

    window.addEventListener("resize", handlerResize);
    // também executa uma vez no mount para garantir valor correto
    handlerResize();

    return () => window.removeEventListener("resize", handlerResize);
  }, []);

  // carregar é memoizado para satisfazer o eslint e evitar recriações desnecessárias
  const carregar = useCallback(
    async (pagina = 1) => {
      try {
        setLoading(true);

        // Chama a API com page, limit, busca e AGORA generoAtivo
        const res = await JogosService.getJogos(pagina, itensPorPagina, busca, generoAtivo);

        // Detecta onde vem a lista (sua API pode retornar formatos diferentes)
        const lista = res.jogos || [];

        // Detecta totalPages de forma segura
        const paginas = res.totalPages || 1;

        setJogos(lista);
        setTotalPages(Number(paginas) || 1);
      } catch (error) {
        console.error("Erro ao carregar jogos:", error);
        setJogos([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [itensPorPagina, busca, generoAtivo] // Adicionado generoAtivo nas dependências
  );

  // Recarrega sempre que page OU itensPorPagina mudarem.
  // Note: itensPorPagina já seta page=1 na mudança 
  useEffect(() => {
    // Implementação de Debounce: evita chamadas excessivas ao digitar na busca
    const delayBusca = setTimeout(() => {
      carregar(page);
    }, 500);

    return () => clearTimeout(delayBusca);
  }, [page, itensPorPagina, carregar]);

  // Se a busca ou o gênero mudar, voltamos para a página 1
  useEffect(() => {
    setPage(1);
  }, [busca, generoAtivo]);

  useEffect(() => {
    async function carregarStatus() {
      try {
        const dados = await listarStatus();
        const mapa = {};
        dados.forEach((item) => {
          mapa[item.game_id] = item.status;
        });
        setStatusJogos(mapa);
      } catch {
        // usuário não logado → ignora
      }
    }

    carregarStatus();
  }, []);

  const [mensagemFeedback, setMensagemFeedback] = useState(null);

  async function marcarStatus(jogoId, novoStatus) {
    try {
      await salvarStatusGame(jogoId, novoStatus);
      setStatusJogos((prev) => ({
        ...prev,
        [jogoId]: novoStatus
      }));

      setMensagemFeedback(`Adicionado à lista: ${novoStatus}`);

      // Limpa após 3 segundos
      setTimeout(() => setMensagemFeedback(null), 4000)
    } catch (error) {
      setMensagemFeedback("Você precisa estar logado para marcar um status.");
      setTimeout(() => setMensagemFeedback(null), 7000);
    }
  }

  return (
    <>
      {mensagemFeedback && (
        <div className="feedback-popup">
          {mensagemFeedback}
        </div>
      )}
      
      <header className="jogos-header-topo">
        <h1>Biblioteca de Jogos</h1>
        <p>Explore o catálogo e adicione jogos à sua coleção</p>
      </header>

      {/* Barra de Busca atualizada com Props de Gênero */}
      <BarraBusca 
        valor={busca} 
        setValor={setBusca} 
        generos={generos}
        generoAtivo={generoAtivo}
        setGeneroAtivo={setGeneroAtivo}
        placeholder="Pesquise um jogo para adicionar..." 
      />

      {/* Lista */}
      <main className="jogos-container">
        {loading ? (
          <p style={{ textAlign: "center", color: "white", padding: "20px" }}>Carregando jogos...</p>
        ) : (
          <section className="jogos-lista">
            {jogos.length === 0 && (
              <p className="nenhum-jogo">Nenhum jogo encontrado.</p>
            )}

            {jogos.map((jogo) => (
              <GameCard
                key={jogo.id}
                jogo={jogo}
                onClick={setJogoSelecionado}
              />
            ))}
          </section>
        )}

        {/* Modal */}
        <ModalJogo 
          jogo={jogoSelecionado} 
          onClose={() => setJogoSelecionado(null)}
          usuarioLogado={usuarioLogado}
          statusJogos={statusJogos}
          onMarcarStatus={marcarStatus}
        />
      </main>

      {/* Paginação */}
      <nav className="paginacao">
        <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
          ⬅ Anterior
        </button>

        <span>
          Página {page} de {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
        >
          Próxima ➡
        </button>
      </nav>
    </>
  );
}

export default Jogos;