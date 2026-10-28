# Backend — Apex Auctions API

Serviço REST e WebSockets da plataforma de leilões online Apex Auctions, desenvolvido em Node.js com TypeScript, Clean Architecture e princípios SOLID.

---

## Arquitetura de Software

O backend segue a Clean Architecture com isolamento estrito do domínio:

- **Domain (`src/domain/`)**: Entidades de negócio (`User`, `Lot`, `Bid`, `Receipt`), erros de domínio tipados e interfaces abstratas de repositório (`ILotRepository`, `IBidRepository`, `IUserRepository`, `IReceiptRepository`). Não possui dependências externas ou conhecimento de banco de dados.
- **Application (`src/application/`)**: Casos de uso da aplicação (`PlaceBidUseCase`, `VerifyLotAuditUseCase`, `CreateLotUseCase`, `CloseExpiredLotsUseCase`, `ListLotsUseCase`, etc.) e contratos de serviços/portas (`IHashService`, `ITokenService`, `IPasswordHasher`, `IWebSocketEmitter`, `IExternalItemGateway`).
- **Infrastructure (`src/infrastructure/`)**: Adaptadores técnicos de persistência e serviços (Prisma ORM com PostgreSQL, `Sha256HashService`, `DummyJsonItemGateway`, `BcryptPasswordHasher`, `JwtTokenService`, Socket.IO).
- **Presentation (`src/presentation/`)**: Controladores HTTP Express, rotas, middlewares de autenticação JWT, controle de perfis (`LEILOEIRO` / `LICITANTE`), rate limiting e documentação Swagger/OpenAPI.
- **Main (`src/main/`)**: Composição de dependências (`container.ts`), configuração de ambiente (`env.ts`), inicializador Express (`app.ts`) e servidor HTTP com rotina de background para fechamento de lotes expirados a cada 5 segundos (`server.ts`).

---

## Funcionalidades Principais

- **Cadeia Criptográfica Antiadulteração (Hash Chain SHA-256)**: Cada lance é matematicamente encadeado ao hash do lance anterior a partir de um bloco gênese único por lote.
- **Auditoria Pública de Lances**: Endpoint `GET /api/lots/:id/audit` que recalcula e valida integralmente a integridade da corrente.
- **Controle de Saldo e Custódia**: Reserva atômica de saldo do licitante líder e liberação automática quando superado.
- **Proteção Anti-Sniping**: Prorrogação automática de 2 minutos caso um lance seja registrado nos últimos 2 minutos do lote.
- **Rate Limiting Escalonado**:
  - Global: 300 requisições / 15 min por IP.
  - Autenticação (`/api/auth/*`): 20 tentativas / 15 min por IP.
  - Lances (`POST /api/lots/:id/bids`): 30 lances / 1 min por IP.
- **WebSockets em Tempo Real**: Notificação instantânea de novos lances, prorrogações e encerramentos via Socket.IO.

---

## Variáveis de Ambiente

Crie o arquivo `.env` na raiz do diretório `backend/` com base no exemplo abaixo:

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `PORT` | Porta do servidor HTTP | `3001` |
| `DATABASE_URL` | URL de conexão PostgreSQL | `postgresql://postgres:postgres@localhost:5432/verzel_auctions` |
| `JWT_SECRET` | Chave secreta para assinatura dos tokens | `secret_jwt_key_aqui` |
| `CORS_ORIGIN` | Origem permitida para requisições cross-origin | `http://localhost:5173` ou `*` |
| `DUMMYJSON_URL` | URL base da API externa de produtos | `https://dummyjson.com` |

---

## Comandos Disponíveis

```bash
# Instalar dependências
npm install

# Executar migrações no banco de dados via Prisma
npx prisma db push

# Povoar banco de dados com dados iniciais (Seed)
npm run seed

# Executar suíte de testes unitários automatizados
npm test

# Executar servidor em modo de desenvolvimento com hot-reload
npm run dev

# Compilar código TypeScript para JavaScript (dist/)
npm run build

# Iniciar servidor compilado em produção
npm run start
```

---

## Documentação Interativa da API

Com o servidor em execução, acesse a documentação interativa Swagger:
- Local: `http://localhost:3001/api/docs`
- Produção: `https://apex-auctions-backend.onrender.com/api/docs`
