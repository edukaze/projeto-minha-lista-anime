import api from "./api";


export const buscaFeedComunidade = async () =>{

    try{
        const response = await api.get('/comunidade');

        return response.data;
    }catch(error){
        console.error("Erro ao busca dados da comunidade:", error);
        throw error
    }
};

export const buscaDetalhesJogo = async (jogoId) => {
    try {
        const response = await api.get(`/comunidade/jogo/${jogoId}`);
        
        return response.data;
        
    } catch (error) {
        console.error("Erro ao buscar detalhes do jogo:", error);
        throw error;
    }
}