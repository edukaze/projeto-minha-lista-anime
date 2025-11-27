import "../estilos/home.css"

function Home(){
    return (
        <main id="home">
            {/* banner */}
            <section className="banner">
                <h2>Bem-Vindo ao MYGamesList</h2>
                <p>Organize seus Jogos favoritos em um só lugar e interaja com a comunidade!</p>
            </section>


            {/*barra de pesquisar*/}
            <section className="pesquisa-container">
                <input type="text" 
                    placeholder="O que estar procurando?"
                    className="pesquisa-input"/>
            </section>


            {/*destaques*/}
            <section className="destaques">
                <h3>Em Destaque</h3>
                <article className="lista-jogos">
                    <div className="jogo-card">Jogo 1</div>
                    <div className="jogo-card">Jogo 2</div>
                    <div className="jogo-card"> jogo 3</div>
                </article>
            </section>

            {/*comunidade*/}
            <section className="comunidade">
              <h3> Destaques da Comunidade</h3>
              <article className="discucoes">
                <div className="discucoes-card"></div>
                <div className="discucoes-card"></div><div className="discucoes-card"></div>
              </article>
            </section>


            {/*lançamentos*/}
            <section className="lancamentos">
                <h3>Lançamento</h3>
                <article className="lancamento">
                    <div className="lancamentos-card"></div>
                    <div className="lancamentos-card"></div>
                    <div className="lancamentos-card"></div>
                    <div className="lancamentos-card"></div>
                </article>
            </section>   
        </main>
    );
}

export default Home;