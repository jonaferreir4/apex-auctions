# Apex Auctions — Casa de Leilões Online com Auditoria Criptográfica

> Desafio Técnico [ELITE DEV] Desenvolvedor Full Stack Júnior — Verzel  
> Aplicação full stack de leilões ao vivo com liquidação em custódia, integridade matemática da cadeia de lances (SHA-256 Hash Chain) e arquiteturas escaláveis (Clean Architecture + SOLID no backend, Feature-Sliced Design no frontend).

---

## Ambientes de Produção

| Serviço | URL | Descrição |
| :--- | :--- | :--- |
| Frontend Web | https://apex-auctions.vercel.app | Interface SPA hospedada na Vercel |
| Backend API | https://apex-auctions-backend.onrender.com/api | API REST e WebSockets hospedada no Render |
| Swagger Docs | https://apex-auctions-backend.onrender.com/api/docs | Documentação interativa OpenAPI 3.0 |

---

## Visão Geral do Sistema

A Apex Auctions é uma plataforma de leilões eletrônicos em tempo real que soluciona o problema da confiança em leilões virtuais por meio de:

1. **Cadeia Criptográfica Antiadulteração (Hash Chain SHA-256)**: Cada lance gerado no sistema é matematicamente encadeado ao hash do lance anterior. Qualquer manipulação direta no banco de dados invalida a corrente a partir do registro fraudado.
2. **Página Pública de Auditoria**: Qualquer participante ou órgão regulador pode inspecionar e auditar a árvore de integridade de qualquer lote, sem necessidade de autenticação (`/lote/:id/auditoria`).
3. **Gestão de Custódia e Saldo Comprometido**: Lances ativos bloqueiam o valor correspondente na carteira do arrematante temporariamente. Caso o lance seja superado, o saldo retorna instantaneamente. Ao término do leilão, a liquidação é definitiva e um certificado digital com token público compartilhável é emitido.
4. **Proteção Anti-Sniping (Prorrogação Dinâmica)**: Lances efetuados nos últimos 2 minutos de um lote prorrogam automaticamente o encerramento em +2 minutos, impedindo bots de sniping de última hora.
5. **Integração Externa Resiliente**: Catálogo de itens integrado à API pública da DummyJSON com mecanismo de fallback resiliente e desacoplamento do domínio de negócio.
6. **Rate Limiting Escalonado**: Camadas de proteção contra ataques de força bruta na autenticação, flood de lances e scraping massivo.

---

## Arquitetura de Software

O projeto foi construído respeitando as melhores práticas de engenharia de software e separação estrita de responsabilidades:

### Backend: Clean Architecture e Princípios SOLID
Localizado em `backend/`:
- **Domain (`src/domain/`)**: Entidades puras de negócio (`User`, `Lot`, `Bid`, `Receipt`), erros customizados de domínio (`DomainError`, `BusinessRuleError`, `NotFoundError`, etc.) e interfaces de repositórios (`ILotRepository`, `IBidRepository`, `IUserRepository`, `IReceiptRepository`). Zero acoplamento com bibliotecas externas.
- **Application (`src/application/`)**: Casos de uso orquestrando o fluxo das regras de negócio (e.g. `PlaceBidUseCase`, `VerifyLotAuditUseCase`, `CreateLotUseCase`, `CloseExpiredLotsUseCase`) e portas/abstrações (`IHashService`, `IWebSocketEmitter`, `ITokenService`, `IPasswordHasher`, `IExternalItemGateway`).
- **Infrastructure (`src/infrastructure/`)**: Implementação técnica dos adaptadores (Prisma ORM com PostgreSQL, `Sha256HashService` com `node:crypto`, `SocketIOEmitter`, `DummyJsonItemGateway` com Axios, `BcryptPasswordHasher`, `JwtTokenService`).
- **Presentation (`src/presentation/`)**: Controladores HTTP Express desacoplados, middlewares (`authMiddleware`, `roleMiddleware`, `errorHandlerMiddleware`, `rateLimiterMiddleware`), rotas REST e orquestrador de eventos WebSocket via Socket.IO.
- **Main (`src/main/`)**: Injeção de dependências centralizada (`container.ts`), configuração de variáveis de ambiente (`env.ts`), inicializador Express (`app.ts`) e servidor HTTP/WebSocket com rotina de encerramento periódico de lotes a cada 5 segundos (`server.ts`).

### Frontend: Feature-Sliced Design (FSD)
Localizado em `frontend/`:
- **app**: Provedores de estado global (`QueryProvider`, `AuthProvider`), roteamento (`AppRouter`) e estilos globais (`index.css`).
- **widgets**: Blocos de interface compostos (`Header`, `Footer`, `FeaturedLotsHero`, `BiddingRoomWidget`).
- **features**: Ações de negócio do usuário (`auth`, `place-bid`, `create-lot`, `deposit-funds`, `filter-lots`, `cancel-lot`).
- **entities**: Modelos do domínio frontend (`user`, `lot`, `bid`, `wallet`, `receipt`, `audit`, `external-item`), separando estritamente tipos, serviços HTTP, hooks TanStack Query e componentes visuais.
- **shared**: Componentes atômicos (`Button`, `Logo`, `ThemeToggle`), cliente HTTP Axios, socket singleton e formatadores (BRL, data, hash).

---

## Prova Criptográfica da Cadeia de Lances (Hash Chain SHA-256)

### Como funciona?
Para garantir que o leiloeiro ou invasores do banco de dados não possam inserir lances retroativos, alterar valores ou apagar propostas, cada lance possui um campo `hash` e um campo `previousHash`:

1. **Bloco Gênese**:
   Ao criar o lote, define-se a raiz criptográfica única:
   ```
   genesisHash = SHA256("GENESIS_LOT_" + lotId)
   ```

2. **Encadeamento Criptográfico**:
   Para o primeiro lance ($n = 1$):
   - `previousHash = genesisHash`

   Para cada lance subsequente ($n > 1$):
   - `previousHash = hash_anterior`

   O hash canônico de cada lance é gerado pela concatenação estrita dos seus atributos:
   ```
   hash = SHA256(previousHash + ":" + bidId + ":" + lotId + ":" + bidderId + ":" + amount.toFixed(2) + ":" + createdAt.toISOString())
   ```

3. **Auditoria em Tempo de Execução (`VerifyLotAuditUseCase`)**:
   O caso de uso reconstrói a cadeia a partir do bloco gênese, recalcula cada hash e valida:
   - Se `recalculatedHash === storedHash` (o conteúdo não foi adulterado).
   - Se `previousHash === expectedPreviousHash` (a sequência cronológica não sofreu inserções ou remoções).
   - Caso haja adulteração, o sistema identifica com precisão o índice do primeiro bloco corrompido (`tamperedAtBidIndex`).

---

## Como Executar o Projeto

### Pré-requisitos
- Docker e Docker Compose instalados **OU**
- Node.js (v20+) e PostgreSQL (v16+)

---

### Opção 1: Execução Completa via Docker Compose (Recomendado)

Basta clonar o repositório e executar:

```bash
docker compose up --build
```

O Docker Compose inicializará:
1. `verzel_postgres`: Banco de dados PostgreSQL na porta `5432`.
2. `verzel_backend`: API Node.js, migrações Prisma, seed de dados e servidor na porta `3001`.
3. `verzel_frontend`: Aplicação React na porta `3000`.

- Frontend: http://localhost:3000
- API Backend: http://localhost:3001/api
- Documentação Swagger: http://localhost:3001/api/docs

---

### Opção 2: Execução Local para Desenvolvimento

#### 1. Iniciar Banco de Dados PostgreSQL
Caso deseje usar apenas o PostgreSQL do Docker:
```bash
docker compose up postgres -d
```

#### 2. Configurar e Iniciar o Backend
```bash
cd backend
npm install
cp .env.example .env

# Executar migrações do Prisma e povoar banco de dados (Seed)
npx prisma db push
npm run seed

# Executar testes unitários automatizados (13 testes)
npm test

# Iniciar servidor em desenvolvimento com hot-reload
npm run dev
```
O backend estará ativo em `http://localhost:3001`.
Documentação interativa Swagger disponível em `http://localhost:3001/api/docs`.

#### 3. Configurar e Iniciar o Frontend
Em outro terminal:
```bash
cd frontend
npm install
cp .env.example .env

# Iniciar servidor de desenvolvimento Vite
npm run dev
```
O frontend estará acessível em `http://localhost:5173`.

---

## Contas de Teste Pré-Configuradas (Seed)

O banco de dados já possui contas prontas para teste através da tela de Login:

| Perfil | Nome | E-mail | Senha | Saldo Inicial |
| :--- | :--- | :--- | :--- | :--- |
| Leiloeiro | Carlos Leiloeiro Oficial | `leiloeiro@verzel.com` | `password123` | N/A (Cria e gerencia lotes) |
| Licitante 1 | Marina Silva | `licitante1@verzel.com` | `password123` | R$ 11.500,00 |
| Licitante 2 | Roberto Lins | `licitante2@verzel.com` | `password123` | R$ 20.000,00 (R$ 2.800 comprometido) |

### Cenários de Lote já Seedados:
- **Ao Vivo**: *Pintura Óleo sobre Tela: "Noite Estrelada no Vale"* — com 2 lances prévios encadeados (SHA-256) e Roberto Lins como líder ativo (R$ 2.800,00).
- **Agendados**: *Relógio Cronógrafo Suíço Vintage 1968*, *Miniatura Rara Shelby Cobra 427 S/C* e *Vinil The Dark Side of the Moon*.
- **Encerrado**: *Primeira Edição: Dom Casmurro (1899)* — arrematado por Marina Silva por R$ 3.500,00 com certificado digital emitido (`recibo-demo-dom-casmurro-1899`).

---

## Suíte de Testes Automatizados

O backend conta com testes unitários cobrindo o core de domínio e regras de negócio essenciais (`backend/tests/`):
- `tests/hashChainAudit.test.ts`:
  - Validação da formação correta do bloco gênese.
  - Encadeamento contínuo de lances legítimos com SHA-256.
  - Detecção imediata de violação quando um registro intermediário tem o valor ou timestamp alterado.
- `tests/placeBidRules.test.ts`:
  - Bloqueio de lance abaixo do preço inicial.
  - Bloqueio de lance abaixo do incremento mínimo exigido.
  - Bloqueio do próprio líder cobrir o próprio lance consecutivo.
  - Bloqueio por saldo insuficiente em carteira.
  - Verificação de anti-sniping (+2 minutos quando lance ocorre nos últimos 2 min).
- `tests/userEntity.test.ts`:
  - Encriptação de senhas, validação de e-mail e regras de perfil.

Para rodar os testes:
```bash
cd backend
npm test
```

---

## Endpoints Principais da API REST

Acesse a documentação interativa Swagger completa em: `/api/docs`

| Método | Rota | Descrição | Autenticação |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Cadastro de usuário (Licitante ou Leiloeiro) | Pública (Rate Limited) |
| `POST` | `/api/auth/login` | Login com geração de JWT | Pública (Rate Limited) |
| `GET` | `/api/auth/me` | Dados do perfil do usuário autenticado | Bearer Token |
| `GET` | `/api/lots` | Listagem de lotes com filtros e paginação | Pública |
| `GET` | `/api/lots/:id` | Detalhes de um lote e lance líder | Pública |
| `POST` | `/api/lots` | Criação de novo lote a partir de item | Leiloeiro |
| `POST` | `/api/lots/:id/cancel` | Cancelamento com reembolso de custódia | Leiloeiro |
| `GET` | `/api/lots/:id/bids` | Histórico cronológico de lances | Pública |
| `POST` | `/api/lots/:id/bids` | Envio de novo lance ao vivo | Licitante (Rate Limited) |
| `GET` | `/api/lots/:id/audit` | Relatório público de integridade da Hash Chain | Pública |
| `GET` | `/api/wallet/balance` | Consulta de saldo disponível e comprometido | Licitante |
| `POST` | `/api/wallet/deposit` | Depósito simulado de saldo | Licitante |
| `GET` | `/api/receipts/my-receipts` | Lotes arrematados pelo licitante | Licitante |
| `GET` | `/api/receipts/share/:token` | Certificado público digital de arremate | Pública |
| `GET` | `/api/items/search` | Consulta externa à DummyJSON API | Leiloeiro |

---

## Relato do Uso de Ferramentas de Inteligência Artificial

> Em conformidade com o edital do Desafio Técnico Verzel Elite Dev 2026, documentamos a seguir como a Inteligência Artificial foi incorporada no ciclo de desenvolvimento deste projeto.

### 1. Ferramentas Utilizadas
- **Claude / Gemini (Antigravity IDE Assistant)**: Atuou como copiloto de engenharia full-stack, auxiliando no planejamento arquitetural, geração de boilerplate de testes e revisão de tipagem.

### 2. Onde a IA Agregou Alta Produtividade
- **Estruturação de Clean Architecture e Tipos**: Agilizou a escrita de dezenas de contratos (`Entities`, `Repositories`, `UseCases`, `DTOs`), garantindo que o domínio permanecesse 100% puro e isolado da infraestrutura.
- **Implementação da Hash Chain Criptográfica**: Geração precisa da fórmula de hashing canônico SHA-256 no backend e sincronização correspondente no relatório de auditoria pública no frontend.
- **Design System e Telas**: Suporte na criação dos tokens CSS, responsividade mobile (off-canvas drawer) e alternância nativa entre modo claro e escuro.
- **Cenários de Teste**: Geração rápida de fixtures e casos de borda nos testes de concorrência e regras de lances (anti-sniping, validação de incremento, saldo comprometido).

### 3. Onde Exigiu Revisão Crítica e Intervenção Humana
- **Concorrência e atomicidade financeira**: As primeiras sugestões realizavam verificações de saldo em etapas separadas, o que poderia permitir condições de corrida (*race conditions*) com dois lances simultâneos. Foi necessário intervir e estruturar uma transação atômica que calcula o saldo retido de outros lotes ativos antes de comprometer novos fundos.
- **Fechamento de Lotes e Anti-Sniping**: A sincronização entre o timer reativo de tela e a rotina de background no backend exigiu calibração para garantir que o prolongamento de 2 minutos seja refletido tanto via WebSocket quanto persistido no banco para consumidores subsequentes.
- **Resiliência da API de Terceiros (DummyJSON)**: Garantir que a falha de conectividade ou rate limit da API externa nunca interrompa o catálogo interno ou impeça a criação manual de lotes.

### 4. Conclusão
O desenvolvimento assistido por IA multiplicou a velocidade de entrega do boilerplate, documentação e testes, permitindo ao desenvolvedor focar no que realmente diferencia um produto de alta qualidade: consistência de regras de negócio, segurança criptográfica e refinamento da experiência do usuário.

---

## Autor
- **Candidato**: Jona Ferreira de Sousa
- **GitHub**: https://github.com/jonaferreir4