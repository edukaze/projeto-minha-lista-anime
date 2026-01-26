import React from 'react';
import '../estilos/BarraBusca.css';

const BarraBusca = ({ valor, setValor, placeholder }) => {
  return (
    <div className="busca-container">
      <div className="busca-wrapper">
        <span className="busca-icone">🔍</span>
        <input 
          type="text" 
          placeholder={placeholder || "Pesquisar..."} 
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="input-busca"
        />
        {valor && (
          <button className="limpar-busca" onClick={() => setValor("")}>✕</button>
        )}
      </div>
    </div>
  );
};

export default BarraBusca;