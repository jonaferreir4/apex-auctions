# Frontend — Apex Auctions Client

Interface web da plataforma de leilões online Apex Auctions, desenvolvida em React com TypeScript e arquitetura Feature-Sliced Design (FSD).

---

## Arquitetura de Software

O frontend foi estruturado seguindo os princípios de Feature-Sliced Design (FSD) para garantir alta manutenibilidade, coesão e baixo acoplamento:

- **app (`src/app/`)**: Inicialização da aplicação, provedores globais de estado (`QueryProvider`, `AuthProvider`), roteamento declarativo (`AppRouter`) e estilos globais (`index.css`).
- **pages (`src/pages/`)**: Páginas da aplicação (`vitrine`, `search`, `lot-detail`, `login`, `bids-history`, `auctioneer-panel`, `receipt-detail`).
- **widgets (`src/widgets/`)**: Blocos autônomos e compostos de interface, como o cabeçalho (`Header`), rodapé (`Footer`), carrossel de destaques (`FeaturedLotsHero`) e a sala de pregão em tempo real (`BiddingRoomWidget`).
- **features (`src/features/`)**: Ações e interações diretas do usuário (`auth`, `place-bid`, `create-lot`, `deposit-funds`, `filter-lots`, `cancel-lot`).
- **entities (`src/entities/`)**: Modelos e componentes de domínio reutilizáveis (`user`, `lot`, `bid`, `wallet`, `receipt`, `audit`, `external-item`), separando contratos (`types.ts`), camada de API (`api/`), hooks reativos (`model/`) e componentes visuais (`ui/`).
- **shared (`src/shared/`)**: Componentes atômicos e utilitários agnósticos de domínio (`Button`, `Logo`, `ThemeToggle`, cliente HTTP Axios, singleton de WebSocket Socket.IO e formatadores de moeda, data e hash).

---

## Tecnologias Utilizadas

- **React 18** com **TypeScript**
- **Vite** para empacotamento rápido e Hot Module Replacement (HMR)
- **Tailwind CSS v4** com suporte nativo a temas Claro e Escuro
- **TanStack React Query v5** para gerenciamento de cache de servidor, sincronização e mutações
- **Socket.IO Client** para eventos em tempo real
- **React Router DOM v6** para roteamento Single Page Application (SPA)
- **Lucide React** para ícones vetoriais padronizados
- **Canvas Confetti** para celebração visual de arremates

---

## Variáveis de Ambiente

Crie o arquivo `.env` na raiz do diretório `frontend/`:

| Variável | Descrição | Exemplo Local | Exemplo Produção |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | URL base da API REST | `http://localhost:3001/api` | `https://apex-auctions-backend.onrender.com/api` |
| `VITE_WS_URL` | URL do servidor WebSocket | `http://localhost:3001` | `https://apex-auctions-backend.onrender.com` |

---

## Comandos Disponíveis

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento Vite
npm run dev

# Compilar aplicação para produção (dist/)
npm run build

# Visualizar build de produção localmente
npm run preview
```

---

## Deploy em Produção

A aplicação é implantada automaticamente via Vercel com rewrites de Single Page Application configurados no arquivo `vercel.json`.
- URL de Produção: `https://apex-auctions.vercel.app`
