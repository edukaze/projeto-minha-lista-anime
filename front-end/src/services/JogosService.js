import api from "./api"

const API_URL = "http://localhost:3001/api";

// Busca jogos com paginação
async function getJogos(page = 1, limit = 10, busca = "", genero = null) {
    try {
        const response = await api.get(`${API_URL}/jogos`, {
            params: { page,
                 limit, 
                busca,
                genero
            }
        });
        return response.data;
    } catch (error) {
        console.log("Erro ao buscar jogos: ", error);
        throw error;
    }
}
async function getGeneros() {
    try {
        const response = await api.get(`${API_URL}/generos`);
        return response.data.generos; 
    } catch (error) {
        console.log("Erro ao buscar gêneros: ", error);
        throw error;
    }
}


const JogosService = {
  getJogos,
  getGeneros
};

export default JogosService;
