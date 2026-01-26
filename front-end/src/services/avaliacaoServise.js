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