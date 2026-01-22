import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Header from "./componentes/Hearder/Header";
import Home from "./paginas/Home";
import Jogos from "./paginas/Jogos";
import Login from "./paginas/Login";
import Cadastro from "./paginas/Cadastro";
import RotaProtegida from "./routes/RotaProtegida";


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

    <Route
      path="/comunidade"
      element={
        <>
          <Header />
          {/* <Comunidade /> */}
        </>
      }
    />

    {/* PROTEGIDAS */}
    <Route
      path="/perfil"
      element={
        <RotaProtegida>
          <Header />
          {/* <Perfil /> */}
        </RotaProtegida>
      }
    />

  </Routes>
</BrowserRouter>

  );
}

export default App;