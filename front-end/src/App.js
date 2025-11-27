import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Header from "./componentes/Hearder/Header";
import Home from "./paginas/Home";
import Login from "./paginas/Login";
import Cadastro from "./paginas/Cadastro";



function App() {

  //garantindo tema salvo independe da tela mostrada
  useEffect(() => {
    const temaSalvo = localStorage.getItem("tema") || "claro";
    document.documentElement.setAttribute("data-tema", temaSalvo);
  }, []);
  
  return (
      
  <BrowserRouter>
      <Routes>

        {/* ROTAS SEM HEADER */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* ROTAS COM HEADER */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <Home />
            </>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;