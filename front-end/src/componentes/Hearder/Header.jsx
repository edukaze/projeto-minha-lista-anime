import "../../estilos/Header.css";
import { useState, useEffect } from "react";
import { estaLogado, logout as sair } from "../../services/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  faBars,
  faXmark,
  faHouse,
  faGamepad,
  faUsers,
  faUser,
  faMoon,
  faSun,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [logado, setLogado] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const temaInicial = localStorage.getItem("tema") || "claro";
  const [tema, setTema] = useState(temaInicial);

  useEffect(() => {
    setLogado(estaLogado());
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.setAttribute("data-tema", tema);
    localStorage.setItem("tema", tema);
  }, [tema]);

  function handleLogout() {
    sair();
    setLogado(false);
    navigate("/login");
  }

  const trocarTema = () => setTema(tema === "claro" ? "escuro" : "claro");
  const abrirMenu = () => setMenuAberto(true);
  const fecharMenu = () => setMenuAberto(false);

  return (
    <header id="header">
      <div className="topo">
        {/* LADO ESQUERDO: HAMBURGUER + LOGO */}
        <div className="logo-section">
          <button className="hamburguer" onClick={abrirMenu}>
            <FontAwesomeIcon icon={faBars} />
          </button>
          <h1 className="logo logo-desktop">MyGamesList</h1>
        </div>

        {menuAberto && <div className="overlay" onClick={fecharMenu}></div>}

        {/* LADO DIREITO: NAVEGAÇÃO */}
        <nav className={`menu-mobile ${menuAberto ? "aberto" : ""}`}>
          <button className="fechar" onClick={fecharMenu}>
            <FontAwesomeIcon icon={faXmark} />
          </button>

            <h2 className="logo-mobile-menu">MyGamesList</h2>

          <ul>
            <li>
              <Link to="/" className="item-header" onClick={fecharMenu}>
                <FontAwesomeIcon icon={faHouse} /> <span>HOME</span>
              </Link>
            </li>
            <li>
              <Link to="/jogos" className="item-header" onClick={fecharMenu}>
                <FontAwesomeIcon icon={faGamepad} /> <span>JOGOS</span>
              </Link>
            </li>
            <li>
              <Link to="/comunidade" className="item-header" onClick={fecharMenu}>
                <FontAwesomeIcon icon={faUsers} /> <span>RESENHAS</span>
              </Link>
            </li>

            {logado && (
              <li>
                <Link to="/perfil" className="item-header" onClick={fecharMenu}>
                  <FontAwesomeIcon icon={faUser} /> <span>PERFIL</span>
                </Link>
              </li>
            )}

            <li id="tema">
              <button className="btn-tema" onClick={trocarTema}>
                <FontAwesomeIcon icon={tema === "claro" ? faMoon : faSun} />
              </button>
              <span className="txt-tema">TEMA</span>
            </li>

            {logado ? (
              <li id="logout" className="item-header" onClick={() => { fecharMenu(); handleLogout(); }}>
                <FontAwesomeIcon icon={faCircleXmark} /> <span>SAIR</span>
              </li>
            ) : (
              <li>
                <Link to="/login" className="item-header" onClick={fecharMenu}>
                  <FontAwesomeIcon icon={faUser} /> <span>LOGIN</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;