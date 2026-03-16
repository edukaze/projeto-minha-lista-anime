const CardResenha = ({ resenha, aoEditar, aoExcluir }) => {
  return (
    <div className="card-resenha-horizontal">
      <div className="resenha-topo">
        <img src={resenha.imagem} alt={resenha.titulo} className="resenha-img" />
        <div className="resenha-info-jogo">
          <h3>{resenha.titulo}</h3>
          <div className="resenha-nota">
             <span>
                &#127775;{resenha.nota}  /5</span>
          </div>
        </div>
      </div>

      <div className="resenha-conteudo">
        <p>{resenha.descricao || "Sem descrição informada."}</p>
      </div>

      <div className="resenha-acoes">
        <button className="btn-editar-resenha" onClick={() => aoEditar(resenha)}>
          &#9998; Editar
        </button>
        <button className="btn-excluir-resenha" onClick={() => aoExcluir(resenha.id_jogo)}>
          &#128465; Apagar
        </button>
      </div>
    </div>
  );
};

export default CardResenha;