import "../estilos/login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";


function Cadastro() {
    const navigate = useNavigate(); 
    const [erro, setErro] = useState("");

    //ouvindo o elemento form e esperando o resultandoe  fazendo que o formulario não recarregue apos o envio
    const registrar = async (e) =>{
        e.preventDefault();
   
    //pega todos os dados que estao vindo do formulario
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const email = formData.get("email");
    const senha = formData.get("senha");
    const confSenha = formData.get("confsenha");

    setErro("");
    //confirma se as senhas coincidem
    if(senha !== confSenha){
        setErro("As senhas digitadas não coincidem");
        return;
    }
    
    
    try {
      const resposta = await axios.post("http://localhost:3001/api/cadastrar", 
        {username, email, senha}
    );

      console.log(resposta.data);
      e.target.reset();
      navigate("/login");

    } catch (err) {
        if(err.response){
            setErro(err.response.data.erro);
        }else{
            setErro("ERRO ao conectar ao servidor");
        }
      
    }
  }; 
    return (
        <main className="tela-cadastro">
            <h1>MyGamesList</h1>

            <form className="card-cadastro" onSubmit={registrar} id="cadastro">
                <h2>Criar Conta</h2>

                <label htmlFor="iuser">UserName</label>
                <input type="text"
                 placeholder="Seu nome"
                 id="iuser"
                 name="username"/>

                <label htmlFor="iemail">Email</label>
                <input type="email" 
                placeholder="Seu email" 
                id="imais"
                name="email"/>

                <label htmlFor="isenha">Senha</label>
                <input type="password"
                 placeholder="Crie uma senha"
                 id="isenha"
                 name="senha"
                 />

                <label htmlFor="iconfsenha">Confirma Senha</label>
                <input type="password" placeholder="Confirme sua Senha"
                name="confsenha"
                 />
                {/* EXIBIÇÃO DA MENSAGEM DE ERRO AQUI */}
                {erro && (
                    <p style={{ color: 'red', fontSize: '0.9em' }}>
                        {erro}
                    </p>
                )}
                <button className="btn-cadastro">Cadastrar</button>

                <p className="trocar">
                    Já tem conta?
                    <Link to="/login" className="login" >Entrar</Link>
                </p>
            </form>
        </main>
    );
}

export default Cadastro;