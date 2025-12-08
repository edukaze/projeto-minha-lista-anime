import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Header from "./componentes/Hearder/Header";
import Home from "./paginas/Home";
import Jogos from "./paginas/Jogos";
import Login from "./paginas/Login";
import Cadastro from "./paginas/Cadastro";
import RotaProtegida from "./componentes/RotaProtegida";


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

       
        {/* ROTAS PÚBLICAS
        
        <Route path="/comunidade" element={<Comunidade />}></Route>
        */}
        <Route path="/jogos" element={
          <>
            <Header/>
            <Jogos/>  
          </>
          }>

        </Route>

        

         {/* ROTAS PROTEGIDAS */}
        <Route path="/perfil" element={
          <RotaProtegida>
            
          </RotaProtegida>
        } />

        <Route path="Perfil" element={
          <RotaProtegida>
           
          </RotaProtegida>
        }/>

        <Route path="jogos" element={
          <RotaProtegida>
            
          </RotaProtegida>
        }/>

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