import React, { useEffect, useState, useCallback } from "react";
import JogosService from "../services/JogosService";
import { estaLogado } from "../services/auth";
import "../estilos/jogospage.css";
import { listarStatus, salvarStatusGame } from "../services/statusService";

function Jogos() {
  const [jogos, setJogos] = useState([]);
  const [page, setPage] = useState(1);
  const usuarioLogado = estaLogado();

  // itens por página dinâmicos conforme a largura da tela
  const calcularItensPorPagina = () => {
    const largura = window.innerWidth;
    if (largura >= 1400) return 16;
    if (largura >= 1200) return 12;
    if (largura >= 992) return 9;
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
        const res = await JogosService.getJogos(pagina, itensPorPagina);

        // DEBUG importante — abre o console e verifique estes logs
        //console.log("API raw response:", res);

        // Detecta onde vem a lista (sua API pode retornar formatos diferentes)
        const lista =
          (res.data && (res.data.data || res.data.jogos || res.data.results)) ||
          (Array.isArray(res.data) ? res.data : []);

        // Detecta totalPages de forma segura
        const paginas =
          (res.data && (res.data.totalPages || res.data.total_pages || res.data.pages)) ||
          res.totalPages ||
          1;

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
    [itensPorPagina]
  );

  // Recarrega sempre que page OU itensPorPagina mudarem.
  // Note: itensPorPagina já seta page=1 na mudança (veja useEffect acima).
  useEffect(() => {
    carregar(page);
  }, [page, itensPorPagina, carregar]);

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

  async function marcarStatus(jogoId, novoStatus) {
  try {
    await salvarStatusGame(jogoId, novoStatus);
    setStatusJogos((prev) => ({
      ...prev,
      [jogoId]: novoStatus
    }));
  } catch {
    alert("Você precisa estar logado para marcar status");
  }
}


  if (loading)
    return <p style={{ textAlign: "center", color: "white" }}>Carregando...</p>;

  return (
    <>
      {/* Pesquisa */}
      <section className="pesquisa-container">
        <input
          type="text"
          placeholder="O que está procurando?"
          className="pesquisa-input"
        />
      </section>

      {/* Lista */}
      <main className="jogos-container">
        <section className="jogos-lista">
          {jogos.length === 0 && (
            <p className="nenhum-jogo">Nenhum jogo encontrado.</p>
          )}

          {jogos.map((jogo) => (
            <article
              className="jogo-card"
              key={jogo.id}
              onClick={() => setJogoSelecionado(jogo)}
            >
              <img
                src={
                  jogo.imagem ||
                  "https://via.placeholder.com/120x160?text=Sem+Imagem"
                }
                alt={jogo.titulo}
                className="jogo-imagem"
              />
              <h2 className="titulo-mini">{jogo.titulo}</h2>
            </article>
          ))}
        </section>

        {/* Modal */}
        {jogoSelecionado && (
          <div className="modal-fundo" onClick={() => setJogoSelecionado(null)}>
            <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
              <img
                src={
                  jogoSelecionado.imagem ||
                  "https://via.placeholder.com/300x200?text=Sem+Imagem"
                }
                alt={jogoSelecionado.titulo}
                className="modal-img"
              />
              <h2>{jogoSelecionado.titulo}</h2>
              <p>Ano: {jogoSelecionado.ano}</p>
              <p>Desenvolvedora: {jogoSelecionado.desenvolvedora}</p>
              <p>Plataforma: {jogoSelecionado.plataforma}</p>

              <div className="status-botoes">
  {usuarioLogado ? (
    <>
      <button
        className={statusJogos[jogoSelecionado.id] === "jogando" ? "ativo" : ""}
        onClick={() => marcarStatus(jogoSelecionado.id, "jogando")}
      >
        Jogando
      </button>

      <button
        className={statusJogos[jogoSelecionado.id] === "zerado" ? "ativo" : ""}
        onClick={() => marcarStatus(jogoSelecionado.id, "zerado")}
      >
        Zerado
      </button>

      <button
        className={statusJogos[jogoSelecionado.id] === "dropado" ? "ativo" : ""}
        onClick={() => marcarStatus(jogoSelecionado.id, "dropado")}
      >
        Dropado
      </button>
    </>
  ) : (
    <p style={{ marginTop: "10px", color: "var(--texto-secundario)" }}>
      Faça login para marcar o status do jogo
    </p>
  )}
              </div>


              <button className="modal-fechar" onClick={() => setJogoSelecionado(null)}>
                Fechar
              </button>
            </div>
          </div>
        )}
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
