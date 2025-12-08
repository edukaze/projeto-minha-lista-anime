import "../../estilos/Header.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { faBars, faXmark, faHouse, faGamepad, faUsers, faUser, faMoon, faSun,faCircleXmark} from "@fortawesome/free-solid-svg-icons";

function Header() {

  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
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
          <li>
            <Link to="/" className="item-header">
              <FontAwesomeIcon icon={faHouse} /> HOME
            </Link>
          </li>

          <li>
            <Link to="/jogos" className="item-header">
              <FontAwesomeIcon icon={faGamepad} /> JOGOS
            </Link>
          </li>
          <li>
            <Link to="/comnidade" className="item-header">
              <FontAwesomeIcon icon={faUsers} /> COMUNIDADE
            </Link>
            </li>
          {logado &&
              <li>
                <Link to="/perfil"className="item-header">
                  <FontAwesomeIcon icon={faUser} /> PERFIL
                </Link>
              </li>
            }

          {/* botao do tema */}
              <li id="tema" onClick={trocarTema}> 
                <button className="btn-tema" onClick= {(e) => {
                  e.stopPropagation();
                  trocarTema();
                }}
                >
                  <FontAwesomeIcon icon={tema === "claro" ? faMoon : faSun} />
                </button>
                  <span>TEMA</span>
              </li>
            
            {/* so aparece se tive logado*/}
            {logado && (
            
           <li id="logout" onClick={logout} style={{ cursor: "pointer" }} className="item-header">
            <FontAwesomeIcon icon={faCircleXmark} className="btn-sair" />
            <span>SAIR</span>
          </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
