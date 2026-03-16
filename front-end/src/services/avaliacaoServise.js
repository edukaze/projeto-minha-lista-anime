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

// Função para buscar avaliações de um jogo específico
export const buscarAvaliacoes = async (id_jogo) => {

    try {
        const response = await api.get(`/avaliacoes`);
        return response.data;
    }catch (error) {
        console.log("Erro ao buscar Avaliações", error);
        return [];
    }
};

// Função para apagar uma avaliação
export const apagarAvaliacao = async (id_jogo) => {
    try {
        const response = await api.delete(`/avaliacao/${id_jogo}`); 
        return response.data;
    } catch (error) {
        console.log("Erro ao apagar Avaliação", error);
        throw error;
    }   
};

// Função para buscar avaliações de um usuário específico
export const buscarAvaliacoesUsuario = async () => {
    try {
        const response = await api.get(`/avaliacoes/usuario`); 
        return response.data;
    } catch (error) {
        console.log("Erro ao buscar Avaliações do usuário", error);
        return [];
    }  
 };