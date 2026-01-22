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

  /* ===== CONTROLE DE LOGIN ===== */
  const [logado, setLogado] = useState(false);

  // Atualiza sempre que a rota mudar
  useEffect(() => {
    setLogado(estaLogado());
  }, [location.pathname]);

  function handleLogout() {
    sair();
    setLogado(false);
    navigate("/login");
  }

  /* ===== MENU MOBILE ===== */
  const [menuAberto, setMenuAberto] = useState(false);

  function abrirMenu() {
    setMenuAberto(true);
  }

  function fecharMenu() {
    setMenuAberto(false);
  }

  /* ===== TEMA ===== */
  const temaInicial = localStorage.getItem("tema") || "claro";
  const [tema, setTema] = useState(temaInicial);

  function trocarTema() {
    const novoTema = tema === "claro" ? "escuro" : "claro";
    setTema(novoTema);
  }

  useEffect(() => {
    document.documentElement.setAttribute("data-tema", tema);
    localStorage.setItem("tema", tema);
  }, [tema]);

  return (
    <header id="header">
      <div className="topo">
        <button className="hamburguer" onClick={abrirMenu}>
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
            <Link to="/" className="item-header" onClick={fecharMenu}>
              <FontAwesomeIcon icon={faHouse} /> HOME
            </Link>
          </li>

          <li>
            <Link to="/jogos" className="item-header" onClick={fecharMenu}>
              <FontAwesomeIcon icon={faGamepad} /> JOGOS
            </Link>
          </li>

          <li>
            <Link to="/comunidade" className="item-header" onClick={fecharMenu}>
              <FontAwesomeIcon icon={faUsers} /> COMUNIDADE
            </Link>
          </li>

          {/* SÓ APARECE SE ESTIVER LOGADO */}
          {logado && (
            <li>
              <Link to="/perfil" className="item-header" onClick={fecharMenu}>
                <FontAwesomeIcon icon={faUser} /> PERFIL
              </Link>
            </li>
          )}

          {/* BOTÃO DE TEMA */}
          <li id="tema">
            <button
              className="btn-tema"
              onClick={(e) => {
                e.stopPropagation();
                trocarTema();
              }}
            >
              <FontAwesomeIcon icon={tema === "claro" ? faMoon : faSun} />
            </button>
            <span>TEMA</span>
          </li>

          {/* LOGOUT */}
          {logado && (
            <li
              id="logout"
              className="item-header"
              onClick={() => {
                fecharMenu();
                handleLogout();
              }}
              style={{ cursor: "pointer" }}
            >
              <FontAwesomeIcon icon={faCircleXmark} />
              <span>SAIR</span>
            </li>
          )}

          {/* LOGIN (SE NÃO ESTIVER LOGADO) */}
          {!logado && (
            <li>
              <Link to="/login" className="item-header" onClick={fecharMenu}>
                <FontAwesomeIcon icon={faUser} /> LOGIN
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
