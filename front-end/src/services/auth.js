export function getToken() {
  return localStorage.getItem("token");
}

export function estaLogado() {
  return !!localStorage.getItem("token");
 
}


export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}

