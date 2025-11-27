import "../estilos/login.css";
import { Link } from "react-router-dom";

function Cadastro() {
    return (
        <main className="tela-cadastro">
            <h1>MyGamesList</h1>

            <form className="card-cadastro">
                <h2>Criar Conta</h2>

                <label htmlFor="iuser">UserName</label>
                <input type="text" placeholder="Seu nome" id="iuser"/>

                <label htmlFor="iemail">Email</label>
                <input type="email" placeholder="Seu email" id="imais"/>

                <label htmlFor="isenha">Senha</label>
                <input type="password" placeholder="Crie uma senha" id="isenha" />

                <label htmlFor="isenha">Confirma Senha</label>
                <input type="password" placeholder="Confirme sua Senha" id="isenha" />

                <button className="btn-cadastro">Cadastrar</button>

                <p className="trocar">
                    Já tem conta?
                    <Link to="/login" className="login">Entrar</Link>
                </p>
            </form>
        </main>
    );
}

export default Cadastro;