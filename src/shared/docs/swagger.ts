import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'AgroVision API',
      version: '1.0.0',
      description: `
        # AgroVision - Sistema de Gestão Agrícola

        API RESTful para gerenciamento completo de propriedades agrícolas, incluindo:
        - 🌾 **Culturas**: Gestão de tipos de plantios e variedades
        - 🗺️ **Áreas**: Controle de terrenos e divisões da propriedade
        - 👥 **Clientes**: Cadastro e gestão de produtores rurais
        - 🐛 **Pragas**: Monitoramento e controle de pragas
        - 📊 **Perdas**: Registro e análise de perdas na produção

        ## Autenticação
        A API utiliza JWT (JSON Web Tokens) para autenticação. Inclua o token no header:
        \`Authorization: Bearer <seu_token>\`

        ## Códigos de Status
        - **200**: Sucesso
        - **201**: Criado com sucesso
        - **400**: Erro de validação
        - **401**: Não autorizado
        - **404**: Recurso não encontrado
        - **500**: Erro interno do servidor

        ## Paginação
        Rotas de listagem suportam paginação com os parâmetros:
        - \`page\`: Número da página (padrão: 1)
        - \`limit\`: Itens por página (padrão: 10, máximo: 100)
        - \`sort\`: Campo para ordenação
        - \`order\`: Direção da ordenação (asc/desc)

        ## Filtros
        Use query parameters para filtrar resultados:
        - \`search\`: Busca textual
        - \`status\`: Filtro por status
        - \`startDate\` / \`endDate\`: Filtro por período
      `,
      contact: {
        name: 'Equipe AgroVision',
        email: 'contato@agrovision.com.br',
        url: 'https://agrovision.com.br'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de Desenvolvimento'
      },
      {
        url: 'https://api.agrovision.com.br',
        description: 'Servidor de Produção'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT para autenticação'
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Token de acesso ausente ou inválido',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'Token inválido'
                  },
                  message: {
                    type: 'string',
                    example: 'Acesso negado. Token ausente ou inválido.'
                  }
                }
              }
            }
          }
        },
        ValidationError: {
          description: 'Erro de validação dos dados',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'Erro de validação'
                  },
                  message: {
                    type: 'string',
                    example: 'Dados inválidos fornecidos'
                  },
                  details: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        field: {
                          type: 'string',
                          example: 'nome'
                        },
                        message: {
                          type: 'string',
                          example: 'Campo obrigatório'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        NotFoundError: {
          description: 'Recurso não encontrado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'Não encontrado'
                  },
                  message: {
                    type: 'string',
                    example: 'Recurso solicitado não foi encontrado'
                  }
                }
              }
            }
          }
        },
        ServerError: {
          description: 'Erro interno do servidor',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'Erro interno'
                  },
                  message: {
                    type: 'string',
                    example: 'Ocorreu um erro interno no servidor'
                  }
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/api/routes/*.ts', // Rotas principais
    './src/modules/**/controllers/*.ts', // Controllers
    './src/shared/schemas/*.ts' // Schemas compartilhados
  ]
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Application): void => {
  // Configuração customizada do Swagger UI
  const swaggerOptions = {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      tryItOutEnabled: true
    },
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info .title { color: #2e7d32; }
      .swagger-ui .scheme-container { background: #f5f5f5; padding: 10px; border-radius: 5px; }
    `,
    customSiteTitle: 'AgroVision API Documentation',
    customfavIcon: '/favicon.ico'
  };

  // Rota para documentação Swagger
  app.use('/api-docs', swaggerUi.serve);
  app.get('/api-docs', swaggerUi.setup(specs, swaggerOptions));

  // Rota para JSON da especificação
  app.get('/api-docs.json', (req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log('📚 Swagger configurado em http://localhost:3001/api-docs');
};

export { specs };
