import "../../estilos/Header.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { faBars, faXmark, faHouse, faGamepad, faUsers, faUser, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

function Header() {

  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }
  const [logado, setLogado] = useState(false);

  const [menuAberto, setMenuAberto] = useState(false);

  // pega o tema salvo OU usa "claro"
  const temaInicial = localStorage.getItem("tema") || "claro";
  const [tema, setTema] = useState(temaInicial);

  function abriMenu() {
    setMenuAberto(true);
  }
  function fecharMenu() {
    setMenuAberto(false);
  }

  function trocarTema() {
    const novoTema = tema === "claro" ? "escuro" : "claro";
    setTema(novoTema);
  }

  // aplica o tema no HTML SEMPRE que ele mudar
  useEffect(() => {
    document.documentElement.setAttribute("data-tema", tema);
    localStorage.setItem("tema", tema); 
  }, [tema]);

  //verificar se tem usuario logado 
  useEffect(() => {
    const token = localStorage.getItem("token");
    setLogado(!!token);
  }, []);

  return (
    <header id="header">
      <div className="topo">
        <button className="hamburguer" onClick={abriMenu}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <h1 className="logo">MyGamesList</h1>
      </div>

      {menuAberto && <div className="overlay" onClick={fecharMenu}></div>}

      <nav className={`menu-mobile ${menuAberto ? "aberto" : ""}`}>
        <button className="fechar" onClick={fecharMenu}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <ul>
          <li><a href="#"><FontAwesomeIcon icon={faHouse} /> HOME</a></li>
          <li><a href="#"><FontAwesomeIcon icon={faGamepad} /> JOGOS</a></li>
          <li><a href="#"><FontAwesomeIcon icon={faUsers} /> COMUNIDADE</a></li>
          <li><a href="#"><FontAwesomeIcon icon={faUser} /> PERFIL</a></li>

          {/* botao do tema */}
          <li id="tema"><a href="#">TEMA</a>
            <button onClick={trocarTema} className="btn-tema">
              <FontAwesomeIcon icon={tema === "claro" ? faMoon : faSun} />
            </button>
            </li>
            
            {/* so aparece se tive logado*/}
            {logado && (
           <li id="logout" onClick={logout} style={{ cursor: "pointer" }}>
            SAIR
          </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
