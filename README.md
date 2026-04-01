# 🎮 MyGamesList

O **MyGamesList** é uma plataforma Full Stack inspirada em sites de catalogação como *MyAnimeList* e *Letterboxd*, mas focada exclusivamente no universo dos videogames. O objetivo é permitir que os usuários gerenciem sua biblioteca, acompanhem o progresso de seus jogos e compartilhem avaliações com outros membros da comunidade.

---

## 🚀 Funcionalidades Principais

* **Catálogo Dinâmico:** Navegação por carrosséis horizontais de jogos (Destaques, Mais Bem Avaliados e Recentes).
* **Gestão de Biblioteca:** Sistema de status para marcar jogos como:
    * 🕹️ **Jogando**
    * 🏆 **Zerado**
    * ❌ **Dropado**
    * 📅 **Planejado**
* **Comunidade & Resenhas:** Espaço para ler e escrever críticas detalhadas sobre cada título.
* **Perfil Personalizado:** Página do usuário para gerenciar suas próprias resenhas e histórico.
* **Tema Adaptável:** Suporte a Modo Claro e Modo Escuro (Light/Dark Mode) com persistência via `localStorage`.
* **Design Mobile-First:** Interface totalmente otimizada para celulares, com suporte a gestos de toque (scroll lateral).

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React.js**: Biblioteca principal para a interface.
- **React Router Dom**: Gerenciamento de rotas e navegação.
- **CSS3**: Estilização com variáveis (`root`), Flexbox e Grid System.
- **Lucide & FontAwesome**: Conjunto de ícones vetoriais.

### Backend
- **Node.js**: Ambiente de execução.
- **Express**: Framework para a construção da API.
- **MySQL**: Banco de dados relacional para persistência de jogos e usuários.
- **JWT (JSON Web Token)**: Sistema de autenticação e proteção de rotas.

---

## 🎨 Identidade Visual

O projeto segue uma estética **Gamer/Neon**, utilizando contrastes altos e efeitos de brilho (*glow*).

* **Cores de Destaque:** * Primária: `var(--cor-primaria)` (Roxo Gamer)
    * Ação: `var(--acao-primaria)` (Amarelo/Ouro para estrelas)
    * Perigo: `var(--acao-secundaria)` (Vermelho/Rosa para alertas e exclusão)
* **Tipografia:** * Títulos: *Russo One* (Estética de jogos)
    * Textos: *VT323* (Estética Pixel Art) ou *Roboto*.

---

## 📦 Como Instalar e Rodar

1. **Clone o projeto:**
   ```bash
   git clone [https://github.com/seu-usuario/mygameslist.git](https://github.com/seu-usuario/mygameslist.git)