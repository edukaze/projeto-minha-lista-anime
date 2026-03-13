import api from './api';

export const salvarAvaliacao = async (id_jogo, nota, descricao) => {
    try {
    
        const response = await api.post("/avaliar", { id_jogo, nota, descricao });
        return response.data;
    } catch (error) {
        console.log("Erro ao enviar Avaliação", error);
        throw error;
    }
};

export const buscarAvaliacoes = async (id_jogo) => {

    try {
        const response = await api.get(`/avaliacoes`);
        return response.data;
    }catch (error) {
        console.log("Erro ao buscar Avaliações", error);
        return [];
    }
};