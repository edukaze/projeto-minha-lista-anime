import "../estilos/login.css";
import { Link } from "react-router-dom";



//criando tela de login
function Login(){
    return(
        <main className="tela-login">
            <h1>MyGameList</h1>

            <form action="#" className="card-login">
                <h2>Entrar</h2>
                <label htmlFor="iemail-usuario"> Email</label>
                <input type="email" placeholder="Seu e-mail ou usuário" id="iemail-usuario" />
                <label htmlFor="isenha">Senha</label>
                <input type="password" placeholder="Sua senha" id="isenha" />

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