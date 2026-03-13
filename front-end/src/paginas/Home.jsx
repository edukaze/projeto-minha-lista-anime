import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import JogosService from "../services/JogosService";
import { buscarAvaliacoes } from "../services/avaliacaoServise"; // Atenção ao nome do arquivo (Servise com S)

import "../estilos/home.css";

function Home() {
    const [jogos, setJogos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Criamos referências para cada seção de rolagem
    const refDestaques = useRef(null);
    const refMelhores = useRef(null);
    const refRecentes = useRef(null);

    // Função para rolar para o lado
    const rolar = (ref, direcao) => {
        if (ref.current) {
            const larguraCard = 300; // Quanto ele vai andar por clique
            ref.current.scrollBy({
                left: direcao === 'dir' ? larguraCard : -larguraCard,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const carregarTudo = async () => {
            try {
                setLoading(true);

                // 1. Busca simultânea para performance
                const [dadosJogos, dadosAvaliacoes] = await Promise.all([
                    JogosService.getJogos(1, 100), 
                    buscarAvaliacoes()
                ]);


                // 2. Normalização dos dados (Garante que sejam arrays)
                const listaJogos = Array.isArray(dadosJogos) ? dadosJogos : (dadosJogos.jogos || []);
                const listaAvaliacoes = Array.isArray(dadosAvaliacoes) ? dadosAvaliacoes : [];

                // 3. Cruzamento de Dados: Vincula avaliações a cada jogo e calcula média
                const jogosProcessados = listaJogos.map(jogo => {
                    const idAtual = jogo.id_jogo || jogo.id;
                    
                    // Filtra avaliações pertencentes a este jogo específico
                    const avsDoJogo = listaAvaliacoes.filter(av => (av.id_jogo || av.game_id) === idAtual);
                    
                    // Cálculo da média aritmética das notas
                    const media = avsDoJogo.length > 0 
                        ? (avsDoJogo.reduce((soma, a) => soma + Number(a.nota), 0) / avsDoJogo.length).toFixed(1) 
                        : null;

                    return { 
                        ...jogo, 
                        id: idAtual, // Padroniza o ID
                        avaliacoes: avsDoJogo, 
                        mediaNota: media 
                    };
                });

                setJogos(jogosProcessados);
            } catch (error) {
                console.error("Erro crítico na Home:", error);
            } finally {
                setLoading(false);
            }
        };

        carregarTudo();
    }, []);

    // --- LÓGICA DE CATEGORIAS (Calculada após o carregamento) ---
    
   
    // 1. Destaques: Ordena por quem tem MAIS itens no array de avaliações
    const destaques = [...jogos]
        .filter(j => j.avaliacoes && j.avaliacoes.length > 0)
        .sort((a, b) => (b.avaliacoes?.length || 0) - (a.avaliacoes?.length || 0))
        .slice(0, 10);

    // 2. Melhores Notas: Ordena pelo valor numérico da média calculada
    const bemAvaliados = [...jogos]
        .filter(j => j.mediaNota !== null)
        .sort((a, b) => Number(b.mediaNota) - Number(a.mediaNota))
        .slice(0, 10);

    // 3. Recentes: Ordena pelo ano de lançamento do jogo  
    const recentes = [...jogos]
        .filter(jogo => jogo.ano) // Garante que o jogo tenha um ID válido
        .sort((a, b) => Number(b.ano) - Number(a.ano))  
        .slice(0, 10);


    if (loading) return <div className="loading-screen">Carregando MYGamesList...</div>;

    return (
        <main id="home">
            <section className="banner">
                <div className="banner-txt">
                    <h2>Sua Próxima Aventura</h2>
                    <p>Descubra, organize e avalie seus jogos favoritos com a comunidade.</p>
                </div>
            </section>

            <div className="conteiner-principal">
                
                {/* SEÇÃO 1: DESTAQUES (Cards Maiores com Badge de Comentários) */}

                <section className="home-secao">
                    <h3>&#127775; Destaques da Comunidade</h3>
                    <div className="wrapper-rolagem"> 
                        <button className="seta seta-esq" onClick={() => rolar(refDestaques, 'esq')}>  &#x276E;  </button>
                        
                        <div className="rolagem-horizontal" ref={refDestaques}>
                            {destaques.map(jogo => (
                                <Link to={`/jogo/${jogo.id}`} key={jogo.id} className="card-destaque">
                                    <img src={jogo.imagem} alt={jogo.titulo} />
                                    <div className="overlay-info">
                                        <h4>{jogo.titulo}</h4>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <button className="seta seta-dir" onClick={() => rolar(refDestaques, 'dir')}> &#x276F; </button>
                    </div>
                </section>

                {/* SEÇÃO 2: MELHORES AVALIADOS */}
                <section className="home-secao">
                    <h3> Obras-Primas (Melhores Notas)</h3>
                    <div className="wrapper-rolagem">
                            <button className="seta seta-esq" onClick={() => rolar(refMelhores, 'esq')}>  &#x276E;  </button>
                                <div className="rolagem-horizontal" ref={refMelhores}>
                                    {bemAvaliados.map(jogo => (
                                        <Link to={`/jogo/${jogo.id}`} key={jogo.id} className="card-vertical">
                                            <div className="capa-box">
                                                <img src={jogo.imagem} alt={jogo.titulo} />
                                                {jogo.mediaNota && <span className="badge-nota">&#9733; {jogo.mediaNota}</span>}
                                            </div>
                                          
                                        </Link>
                                    ))}
                                </div>
                            <button className="seta seta-dir" onClick={() => rolar(refMelhores, 'dir')}> &#x276F; </button>
                    </div>
                </section>

                {/* SEÇÃO 3: RECENTES */}
                <section className="home-secao">
                    <h3> Adicionados Recentemente</h3>
                    <div className="wrapper-rolagem">
                            <button className="seta seta-esq" onClick={() => rolar(refRecentes, 'esq')}> &#x276E;  </button>
                    <div className="rolagem-horizontal" ref={refRecentes}  >
                        {recentes.map(jogo => (
                            <Link to={`/jogo/${jogo.id}`} key={jogo.id} className="card-vertical">
                                <div className="capa-box">
                                    <img src={jogo.imagem} alt={jogo.titulo} />
                                </div>
                                
                            </Link>
                        ))}
                    </div>
                    <button className="seta seta-dir" onClick={() => rolar(refRecentes, 'dir')}> &#x276F; </button>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Home;