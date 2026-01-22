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