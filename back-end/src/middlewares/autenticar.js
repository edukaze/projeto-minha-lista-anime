const jwt = require("jsonwebtoken");

function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;

  // Verifica se o token veio no header
  if (!authHeader) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  const partes = authHeader.split(" ");
  
  if (partes.length !== 2) {
    return res.status(401).json({ erro: "Erro no formato do token" });
  }

  const [Bearer, token] = partes;

  try {

    // Verifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Salva o usuário na requisição
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.log("Erro na validação do JWT:", error);
    return res.status(401).json({ erro: "Token inválido" });
  }
}

module.exports = autenticar;
