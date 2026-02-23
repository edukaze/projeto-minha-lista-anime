import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useEffect } from "react";
import Header from "./componentes/Hearder/Header";
import Home from "./paginas/Home";
import Jogos from "./paginas/Jogos";
import Login from "./paginas/Login";
import Cadastro from "./paginas/Cadastro";
import Perfil from "./paginas/Perfil";
import Comunidade from "./paginas/Comunidade";
import RotaProtegida from "./routes/RotaProtegida";
import JogoDetalhes from "./componentes/JogoDetalhe";



function App() {

  //garantindo tema salvo independe da tela mostrada
  useEffect(() => {
    const temaSalvo = localStorage.getItem("tema") || "claro";
    document.documentElement.setAttribute("data-tema", temaSalvo);
  }, []);
  
  return (
      
  <BrowserRouter>
  <Routes>

    {/* PÚBLICAS */}
    <Route path="/login" element={<Login />} />
    <Route path="/cadastro" element={<Cadastro />} />

    <Route
      path="/"
      element={
        <>
          <Header />
          <Home />
        </>
      }
    />

    <Route
      path="/jogos"
      element={
        <>
          <Header />
          <Jogos />
        </>
      }
    />

 
  {/* Rota para a lista da Comunidade */}
  <Route
    path="/comunidade"
    element={
      <>
        <Header />
        <Comunidade />
      </>
    }
  />

  {/* Rota para o Detalhe do Jogo (Fora da outra rota) */}
  <Route
    path="/comunidade/jogo/:id"
    element={
      <>
        <Header />
        <JogoDetalhes />
      </>
    }
  />


    {/* PROTEGIDAS */}
    <Route
      path="/perfil"
      element={
        <RotaProtegida>
          <Header />
          <Perfil /> 
        </RotaProtegida>
      }
    />

  </Routes>
</BrowserRouter>

  );
}

export default App;