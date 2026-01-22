import "../estilos/login.css";
import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";



//criando tela de login
function Login(){

    const navigate = useNavigate();
    const [erro, setErro] = useState("");   

    const logar = async (e) =>{
        e.preventDefault();

        const formData = new FormData(e.target);
        const ValorUsuario =  formData.get("usuario");
        const senha = formData.get("senha");

        setErro("");

        if(!ValorUsuario || !senha){
            setErro("por favor preenchar todos os campos ");
            return; 
        }

        try{
            const resposta  = await axios.post("http://localhost:3001/api/login",
                {username: ValorUsuario,
                email: ValorUsuario, 
                senha: senha}
            );
            localStorage.setItem("token", resposta.data.token);

            navigate("/"); 
        }catch(err){
            if(err.response){
                setErro(err.response.data.erro);
            }else {
                setErro("Erro ao conectar com o servidor.");
            }
        }
        
    };


    return(
        <main className="tela-login">
            <h1>MyGameList</h1>

            <form action="#" className="card-login" onSubmit={logar}>
                <h2>Entrar</h2>
                <label htmlFor="iemail-usuario"> Email</label>
                <input type="text" placeholder="Seu e-mail ou usuário" id="iemail-usuario" name="usuario"/>
                <label htmlFor="isenha">Senha</label>
                <input type="password" placeholder="Sua senha" id="isenha" name="senha" />

                {erro && (
                    <p style={{ color: "red", marginTop: "10px" }}>{erro}</p>
                )}

                <button className="btn-login">Entrar</button>
                <p className="trocar">
                    Não tem conta?
                    <Link to="/cadastro" className="cadastro">Criar conta</Link>
                </p>
            </form>
        </main>
    )
}

export default Login;