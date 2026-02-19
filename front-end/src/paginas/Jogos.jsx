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
  const [page, setPage] = useState(1);
  const usuarioLogado = estaLogado();
  const [busca, setBusca] = useState("");

  // itens por página dinâmicos conforme a largura da tela
const calcularItensPorPagina = () => {
    const largura = window.innerWidth;
    if (largura >= 1400) return 18;
    if (largura >= 1200) return 12;
    if (largura >= 992) return 12;
    if (largura >= 768) return 8;
    return 6;
  };

  const [itensPorPagina, setItensPorPagina] = useState(() =>
    // inicializa com base na largura atual
    typeof window !== "undefined" ? calcularItensPorPagina() : 6
  );
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [jogoSelecionado, setJogoSelecionado] = useState(null);
  const [statusJogos, setStatusJogos] = useState({});

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

        // Chama a API com page e limit (itensPorPagina)
        const res = await JogosService.getJogos(pagina, itensPorPagina, busca);
        //console.log("Resposta da API:", res);
        // DEBUG importante — abre o console e verifique estes logs
        //console.log("API raw response:", res);

        // Detecta onde vem a lista (sua API pode retornar formatos diferentes)
        const lista = res.jogos || [];

        // Detecta totalPages de forma segura
        const paginas = res.totalPages || 1;

        setJogos(lista);
        setTotalPages(Number(paginas) || 1);

        // DEBUG sobre paginação
        //console.log("carregar -> page:", pagina, "limit:", itensPorPagina, "lista length:", lista.length, "totalPages:", paginas);
      } catch (error) {
        console.error("Erro ao carregar jogos:", error);
        setJogos([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [itensPorPagina, busca]
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

  useEffect(()=>{
    setPage(1)
  }, [busca]);

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

    
      <BarraBusca 
        valor={busca} 
        setValor={setBusca} 
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
              onClick = {setJogoSelecionado}
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
