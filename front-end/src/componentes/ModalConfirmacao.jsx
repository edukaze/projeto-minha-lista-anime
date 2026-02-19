import React from 'react';
import { useEffect } from 'react';
import '../estilos/ModalConfirmacao.css';

const ModalConfirmacao = ({ mensagem, aoConfirmar, aoCancelar }) => {
    useEffect(() => {
  const fecharNoEsc = (e) => {
    if (e.key === "Escape") aoCancelar();
  };
  window.addEventListener("keydown", fecharNoEsc);
  return () => window.removeEventListener("keydown", fecharNoEsc);
}, [aoCancelar]);
  return (
    <div className="modal-confirmacao-overlay"
    onClick={aoCancelar}>
      <div className="modal-confirmacao-caixa"
      onClick={(e) => e.stopPropagation()}>
        <p>{mensagem}</p>
        <div className="modal-confirmacao-botoes">
          <button className="btn-cancelar" onClick={aoCancelar}>Cancelar</button>
          <button className="btn-confirmar" onClick={aoConfirmar}>Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacao;