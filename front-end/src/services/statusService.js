import api from "./api";

export async function salvarStatusGame(game_id, status) {
    const res = await api.post("/status", {
        game_id,
        status
    });
    return res.data;
}

export async function listarStatus() {
    const res = await api.get("/status");
    return res.data;
}
export const excluirStatusGame = async (gameId) => {
  try {
    // Fazemos um DELETE enviando o ID do jogo na URL
    const response = await api.delete(`/status/${gameId}`);
    return response.data;
  } catch (error) {
    console.error("Erro no service ao excluir status:", error);
    throw error;
  }
};