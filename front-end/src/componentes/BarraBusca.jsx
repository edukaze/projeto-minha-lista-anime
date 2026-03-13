import React from 'react';
import '../estilos/BarraBusca.css';

function BarraBusca({ valor, setValor, placeholder, generos, generoAtivo, setGeneroAtivo }) {
  return (
    <div className="busca-container">
      <div className="busca-wrapper">
        <div className='input-group'>
          <span className="busca-icone">🔍</span>
          <input
            type="text"
          placeholder={placeholder || "Pesquisar..."}
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="input-busca" />
        </div>
        {/* Select de Gêneros ao lado ou abaixo da busca */}
        {generos && (
          <select
            className="select-genero"
            value={generoAtivo || ""}
            onChange={(e) => setGeneroAtivo(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Todos os Gêneros</option>
            {generos.map((gen) => (
              <option key={gen.id} value={gen.id}>
                {gen.nome}
              </option>
            ))}
          </select>
        )}

        {valor && (
          <button className="limpar-busca" onClick={() => setValor("")}>✕</button>
        )}
      </div>
    </div>
  );
}

export default BarraBusca;