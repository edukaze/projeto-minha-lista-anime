const pool = require("../config/db");//requerindo a conexão com o banco
const bcrypt = require("bcrypt"); //protegendo as senha do usuario com hash antes de coloca no banco
const jwt = require("jsonwebtoken");// biblioteca de token para conexão mais segura 


module.exports = {

    //cadastra um usuario 
     async cadastrar(req, res) {
        try {
            const { username, email, senha } = req.body;

            if (!username || !email || !senha) {
                return res.status(400).json({ erro: "Preencha todos os campos!" });
            }

            const hash = await bcrypt.hash(senha, 10);

            await pool.query(
                "INSERT INTO usuarios (username, email, senha) VALUES ($1, $2, $3)",
                [username, email, hash]
            );

            return res.status(201).json({ msg: "Usuário cadastrado com sucesso!" });

        } catch (err) {
            // erro do postgres campo unique (duplicado)
            if (err.code === "23505") {
                return res.status(409).json({ erro: "Username ou email já cadastrado." });
            }

            return res.status(500).json({ erro: err.message });
        }
    },
async login(req, res) {
  try {
    const { email, username, senha } = req.body;

    if ((!email && !username) || !senha) {
      return res.status(400).json({ erro: "Informe email ou username e senha" });
    }

    const { rows: userRows } = await pool.query(
      "SELECT id, username, email, senha FROM usuarios WHERE username = $1 OR email = $2",
      [username || null, email || null]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    const user = userRows[0];

    const valido = await bcrypt.compare(senha, user.senha);

    if (!valido) {
      return res.status(401).json({ erro: "Senha incorreta" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      usuario: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    });

  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}
}
