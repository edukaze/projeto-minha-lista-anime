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