export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Casa de Leilões Verzel - API Documentation',
    version: '1.0.0',
    description: 'API REST e WebSockets da Casa de Leilões online com integridade criptográfica (Hash Chain), anti-sniping e saldo garantido.'
  },
  servers: [
    {
      url: '/',
      description: 'Servidor Atual (Automático)'
    },
    {
      url: 'https://apex-auctions-backend.onrender.com',
      description: 'Ambiente de Produção (Render)'
    },
    {
      url: 'http://localhost:3001',
      description: 'Ambiente Local (Desenvolvimento)'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  paths: {
    '/api/health': {
      get: {
        summary: 'Verificação de integridade da API',
        tags: ['Health'],
        responses: {
          200: {
            description: 'API online'
          }
        }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'Autenticação de usuário (Leiloeiro ou Licitante)',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'licitante1@verzel.com' },
                  password: { type: 'string', example: 'password123' }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          200: { description: 'Login realizado com sucesso e token JWT retornado' },
          401: { description: 'Credenciais inválidas' }
        }
      }
    },
    '/api/auth/register': {
      post: {
        summary: 'Cadastro de novo usuário',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Novo Licitante' },
                  email: { type: 'string', example: 'novo@verzel.com' },
                  password: { type: 'string', example: 'password123' },
                  role: { type: 'string', enum: ['LEILOEIRO', 'LICITANTE'], example: 'LICITANTE' }
                },
                required: ['name', 'email', 'password']
              }
            }
          }
        },
        responses: {
          201: { description: 'Usuário cadastrado com sucesso' },
          409: { description: 'Email já cadastrado' }
        }
      }
    },
    '/api/auth/me': {
      get: {
        summary: 'Obter dados do perfil autenticado',
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Dados do perfil do usuário' },
          401: { description: 'Não autorizado' }
        }
      }
    },
    '/api/lots': {
      get: {
        summary: 'Listar lotes da vitrine com filtros opcionais',
        tags: ['Lots'],
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['AGENDADO', 'AO_VIVO', 'ENCERRADO'] } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } }
        ],
        responses: {
          200: { description: 'Lista de lotes' }
        }
      },
      post: {
        summary: 'Criar novo lote a partir de item da API externa (Exclusivo Leiloeiro)',
        tags: ['Lots'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string', example: 'Relógio Cronógrafo Suíço Vintage 1968' },
                  description: { type: 'string', example: 'Peça de alta relojoaria mecânica em ouro 18k' },
                  imageUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800' },
                  category: { type: 'string', example: 'Relógios & Joias' },
                  initialPrice: { type: 'number', example: 4500 },
                  minIncrement: { type: 'number', example: 250 },
                  startTime: { type: 'string', format: 'date-time', example: new Date().toISOString() },
                  endTime: { type: 'string', format: 'date-time', example: new Date(Date.now() + 3600000).toISOString() }
                },
                required: ['title', 'description', 'imageUrl', 'initialPrice', 'minIncrement', 'startTime', 'endTime']
              }
            }
          }
        },
        responses: {
          201: { description: 'Lote criado com sucesso' },
          403: { description: 'Apenas leiloeiros podem criar lotes' }
        }
      }
    },
    '/api/lots/my-lots': {
      get: {
        summary: 'Listar lotes criados pelo leiloeiro logado',
        tags: ['Lots'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Lista de lotes do leiloeiro' }
        }
      }
    },
    '/api/lots/{id}': {
      get: {
        summary: 'Obter detalhes de um lote específico',
        tags: ['Lots'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Detalhes do lote e próximo lance mínimo' },
          404: { description: 'Lote não encontrado' }
        }
      }
    },
    '/api/lots/{id}/cancel': {
      post: {
        summary: 'Cancelar lote com estorno automático de lances (Exclusivo Leiloeiro)',
        tags: ['Lots'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Lote cancelado e saldo estornado se aplicável' }
        }
      }
    },
    '/api/lots/{id}/bids': {
      get: {
        summary: 'Histórico de lances de um lote (identificadores anonimizados)',
        tags: ['Bids'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 }, description: 'Limite de lances mais recentes a retornar' }
        ],
        responses: {
          200: { description: 'Lista cronológica de lances' }
        }
      },
      post: {
        summary: 'Dar lance em lote ao vivo (Exclusivo Licitante)',
        tags: ['Bids'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  amount: { type: 'number', example: 3000 }
                },
                required: ['amount']
              }
            }
          }
        },
        responses: {
          201: { description: 'Lance aceito com sucesso' },
          422: { description: 'Lance recusado (abaixo do mínimo, saldo insuficiente, líder atual, lote não iniciado/encerrado)' }
        }
      }
    },
    '/api/lots/{id}/audit': {
      get: {
        summary: 'Página Pública de Auditoria Criptográfica (Sem login)',
        tags: ['Audit'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Relatório completo de integridade e verificação da cadeia de hashes SHA-256' }
        }
      }
    },
    '/api/wallet': {
      get: {
        summary: 'Consultar saldo da carteira (Total, Comprometido e Disponível)',
        tags: ['Wallet'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Saldos da carteira' }
        }
      }
    },
    '/api/wallet/deposit': {
      post: {
        summary: 'Depósito simulado na carteira (Exclusivo Licitante)',
        tags: ['Wallet'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  amount: { type: 'number', example: 5000 }
                },
                required: ['amount']
              }
            }
          }
        },
        responses: {
          200: { description: 'Depósito efetuado com sucesso' }
        }
      }
    },
    '/api/receipts/share/{token}': {
      get: {
        summary: 'Visualizar comprovante de arremate público via token de compartilhamento',
        tags: ['Receipts'],
        parameters: [{ name: 'token', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Dados do comprovante e do lote arrematado' },
          404: { description: 'Comprovante não encontrado' }
        }
      }
    },
    '/api/receipts/me': {
      get: {
        summary: 'Meus arremates (Lotes vencidos pelo licitante logado)',
        tags: ['Receipts'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Lista de comprovantes de arremate' }
        }
      }
    },
    '/api/items/search': {
      get: {
        summary: 'Buscar itens na API externa para criação de lotes (com fallback resiliente)',
        tags: ['External Items'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'q', in: 'query', schema: { type: 'string' } }],
        responses: {
          200: { description: 'Lista de itens encontrados na API externa' }
        }
      }
    }
  }
};
