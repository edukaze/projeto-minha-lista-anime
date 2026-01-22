import api from "./api"

const API_URL = "http://localhost:3001/api";

// Busca jogos com paginação
async function getJogos(page = 1, limit = 10) {
    try {
        const response = await api.get(`${API_URL}/jogos`, {
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        console.log("Erro ao buscar jogos: ", error);
        throw error;
    }
}

const JogosService = {
  getJogos,
};

export default JogosService;
