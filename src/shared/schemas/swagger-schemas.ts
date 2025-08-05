/**
 * @swagger
 * components:
 *   schemas:
 *     Area:
 *       type: object
 *       required:
 *         - nome
 *         - tamanho
 *         - unidadeMedida
 *         - clienteId
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único da área
 *           example: "64a1b2c3d4e5f6789012345"
 *         nome:
 *           type: string
 *           description: Nome da área
 *           example: "Área Norte - Soja"
 *           minLength: 2
 *           maxLength: 100
 *         descricao:
 *           type: string
 *           description: Descrição detalhada da área
 *           example: "Área destinada ao plantio de soja, com solo argiloso"
 *           maxLength: 500
 *         tamanho:
 *           type: number
 *           description: Tamanho da área
 *           example: 50.5
 *           minimum: 0.01
 *         unidadeMedida:
 *           type: string
 *           enum: ["hectares", "alqueires", "m²"]
 *           description: Unidade de medida da área
 *           example: "hectares"
 *         coordenadas:
 *           type: object
 *           description: Coordenadas geográficas da área
 *           properties:
 *             latitude:
 *               type: number
 *               example: -23.5505
 *               minimum: -90
 *               maximum: 90
 *             longitude:
 *               type: number
 *               example: -46.6333
 *               minimum: -180
 *               maximum: 180
 *         clienteId:
 *           type: string
 *           description: ID do cliente proprietário da área
 *           example: "64a1b2c3d4e5f6789012340"
 *         status:
 *           type: string
 *           enum: ["ativa", "inativa", "manutencao"]
 *           description: Status atual da área
 *           example: "ativa"
 *           default: "ativa"
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro
 *           example: "2024-01-15T10:30:00.000Z"
 *         dataAtualizacao:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *           example: "2024-01-20T14:45:00.000Z"
 * 
 *     AreaInput:
 *       type: object
 *       required:
 *         - nome
 *         - tamanho
 *         - unidadeMedida
 *         - clienteId
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome da área
 *           example: "Área Norte - Soja"
 *           minLength: 2
 *           maxLength: 100
 *         descricao:
 *           type: string
 *           description: Descrição detalhada da área
 *           example: "Área destinada ao plantio de soja, com solo argiloso"
 *           maxLength: 500
 *         tamanho:
 *           type: number
 *           description: Tamanho da área
 *           example: 50.5
 *           minimum: 0.01
 *         unidadeMedida:
 *           type: string
 *           enum: ["hectares", "alqueires", "m²"]
 *           description: Unidade de medida da área
 *           example: "hectares"
 *         coordenadas:
 *           type: object
 *           description: Coordenadas geográficas da área
 *           properties:
 *             latitude:
 *               type: number
 *               example: -23.5505
 *               minimum: -90
 *               maximum: 90
 *             longitude:
 *               type: number
 *               example: -46.6333
 *               minimum: -180
 *               maximum: 180
 *         clienteId:
 *           type: string
 *           description: ID do cliente proprietário da área
 *           example: "64a1b2c3d4e5f6789012340"
 *         status:
 *           type: string
 *           enum: ["ativa", "inativa", "manutencao"]
 *           description: Status atual da área
 *           example: "ativa"
 *           default: "ativa"
 * 
 *     Cliente:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - telefone
 *         - documento
 *         - tipoDocumento
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único do cliente
 *           example: "64a1b2c3d4e5f6789012340"
 *         nome:
 *           type: string
 *           description: Nome completo do cliente
 *           example: "João Silva"
 *           minLength: 2
 *           maxLength: 100
 *         email:
 *           type: string
 *           format: email
 *           description: Email do cliente
 *           example: "joao.silva@email.com"
 *         telefone:
 *           type: string
 *           description: Telefone do cliente
 *           example: "(11) 99999-9999"
 *         documento:
 *           type: string
 *           description: Número do documento (CPF ou CNPJ)
 *           example: "123.456.789-01"
 *         tipoDocumento:
 *           type: string
 *           enum: ["CPF", "CNPJ"]
 *           description: Tipo do documento
 *           example: "CPF"
 *         endereco:
 *           type: object
 *           description: Endereço do cliente
 *           properties:
 *             rua:
 *               type: string
 *               example: "Rua das Flores, 123"
 *             cidade:
 *               type: string
 *               example: "São Paulo"
 *             estado:
 *               type: string
 *               example: "SP"
 *             cep:
 *               type: string
 *               example: "01234-567"
 *         status:
 *           type: string
 *           enum: ["ativo", "inativo", "suspenso"]
 *           description: Status do cliente
 *           example: "ativo"
 *           default: "ativo"
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro
 *           example: "2024-01-15T10:30:00.000Z"
 *         dataAtualizacao:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *           example: "2024-01-20T14:45:00.000Z"
 * 
 *     Cultura:
 *       type: object
 *       required:
 *         - nome
 *         - tipo
 *         - cicloVida
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único da cultura
 *           example: "64a1b2c3d4e5f6789012341"
 *         nome:
 *           type: string
 *           description: Nome da cultura
 *           example: "Soja"
 *           minLength: 2
 *           maxLength: 100
 *         nomeComum:
 *           type: string
 *           description: Nome comum/popular da cultura
 *           example: "Soja"
 *           maxLength: 100
 *         nomeCientifico:
 *           type: string
 *           description: Nome científico da cultura
 *           example: "Glycine max"
 *           maxLength: 150
 *         tipo:
 *           type: string
 *           enum: ["graos", "frutas", "hortalicas", "cereais", "leguminosas", "oleaginosas", "outros"]
 *           description: Tipo da cultura
 *           example: "oleaginosas"
 *         variedade:
 *           type: string
 *           description: Variedade específica
 *           example: "TMG 7062"
 *           maxLength: 100
 *         cicloVida:
 *           type: number
 *           description: Ciclo de vida em dias
 *           example: 120
 *           minimum: 1
 *         descricao:
 *           type: string
 *           description: Descrição da cultura
 *           example: "Cultura oleaginosa de ciclo anual"
 *           maxLength: 500
 *         status:
 *           type: string
 *           enum: ["ativa", "inativa", "descontinuada"]
 *           description: Status da cultura
 *           example: "ativa"
 *           default: "ativa"
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro
 *           example: "2024-01-15T10:30:00.000Z"
 *         dataAtualizacao:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *           example: "2024-01-20T14:45:00.000Z"
 * 
 *     Praga:
 *       type: object
 *       required:
 *         - nome
 *         - tipo
 *         - nivelRisco
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único da praga
 *           example: "64a1b2c3d4e5f6789012342"
 *         nome:
 *           type: string
 *           description: Nome da praga
 *           example: "Lagarta da Soja"
 *           minLength: 2
 *           maxLength: 100
 *         nomeComum:
 *           type: string
 *           description: Nome comum da praga
 *           example: "Lagarta da Soja"
 *           maxLength: 100
 *         nomeCientifico:
 *           type: string
 *           description: Nome científico da praga
 *           example: "Anticarsia gemmatalis"
 *           maxLength: 150
 *         tipo:
 *           type: string
 *           enum: ["inseto", "fungo", "bacteria", "virus", "nematoide", "erva-daninha", "outros"]
 *           description: Tipo da praga
 *           example: "inseto"
 *         nivelRisco:
 *           type: string
 *           enum: ["baixo", "medio", "alto", "critico"]
 *           description: Nível de risco da praga
 *           example: "alto"
 *         descricao:
 *           type: string
 *           description: Descrição da praga e seus danos
 *           example: "Lagarta que se alimenta das folhas da soja"
 *           maxLength: 500
 *         culturasSuscetiveis:
 *           type: array
 *           description: Lista de culturas suscetíveis à praga
 *           items:
 *             type: string
 *           example: ["Soja", "Milho", "Feijão"]
 *         metodosControle:
 *           type: array
 *           description: Métodos de controle recomendados
 *           items:
 *             type: string
 *           example: ["Controle biológico", "Inseticida específico"]
 *         status:
 *           type: string
 *           enum: ["ativa", "inativa", "monitoramento"]
 *           description: Status da praga
 *           example: "ativa"
 *           default: "ativa"
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro
 *           example: "2024-01-15T10:30:00.000Z"
 *         dataAtualizacao:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *           example: "2024-01-20T14:45:00.000Z"
 * 
 *     Perda:
 *       type: object
 *       required:
 *         - areaId
 *         - culturaId
 *         - tipoPerda
 *         - quantidade
 *         - unidadeMedida
 *         - dataOcorrencia
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único da perda
 *           example: "64a1b2c3d4e5f6789012343"
 *         areaId:
 *           type: string
 *           description: ID da área onde ocorreu a perda
 *           example: "64a1b2c3d4e5f6789012345"
 *         culturaId:
 *           type: string
 *           description: ID da cultura afetada
 *           example: "64a1b2c3d4e5f6789012341"
 *         pragaId:
 *           type: string
 *           description: ID da praga causadora (se aplicável)
 *           example: "64a1b2c3d4e5f6789012342"
 *         tipoPerda:
 *           type: string
 *           enum: ["climatica", "praga", "doenca", "mecanica", "outros"]
 *           description: Tipo da perda
 *           example: "praga"
 *         quantidade:
 *           type: number
 *           description: Quantidade de perda
 *           example: 15.5
 *           minimum: 0
 *         unidadeMedida:
 *           type: string
 *           enum: ["kg", "ton", "sc", "percentual"]
 *           description: Unidade de medida da perda
 *           example: "ton"
 *         valorEstimado:
 *           type: number
 *           description: Valor estimado da perda em R$
 *           example: 25000.50
 *           minimum: 0
 *         dataOcorrencia:
 *           type: string
 *           format: date
 *           description: Data em que a perda foi identificada
 *           example: "2024-01-15"
 *         descricao:
 *           type: string
 *           description: Descrição detalhada da perda
 *           example: "Ataque severo de lagarta resultando em perda significativa"
 *           maxLength: 500
 *         status:
 *           type: string
 *           enum: ["registrada", "em-analise", "resolvida", "irreversivel"]
 *           description: Status da perda
 *           example: "registrada"
 *           default: "registrada"
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro
 *           example: "2024-01-15T10:30:00.000Z"
 *         dataAtualizacao:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *           example: "2024-01-20T14:45:00.000Z"
 * 
 *     PaginatedResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             type: object
 *           description: Array com os dados solicitados
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: number
 *               description: Página atual
 *               example: 1
 *             limit:
 *               type: number
 *               description: Itens por página
 *               example: 10
 *             total:
 *               type: number
 *               description: Total de itens
 *               example: 150
 *             pages:
 *               type: number
 *               description: Total de páginas
 *               example: 15
 *             hasNext:
 *               type: boolean
 *               description: Indica se há próxima página
 *               example: true
 *             hasPrev:
 *               type: boolean
 *               description: Indica se há página anterior
 *               example: false
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Tipo do erro
 *           example: "ValidationError"
 *         message:
 *           type: string
 *           description: Mensagem de erro
 *           example: "Dados inválidos fornecidos"
 *         details:
 *           type: array
 *           description: Detalhes específicos do erro
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 example: "nome"
 *               message:
 *                 type: string
 *                 example: "Campo obrigatório"
 * 
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Operação realizada com sucesso"
 *         data:
 *           type: object
 *           description: Dados de resposta (opcional)
 * 
 *     User:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - senha
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único do usuário
 *           example: "64a1b2c3d4e5f6789012345"
 *         nome:
 *           type: string
 *           description: Nome completo do usuário
 *           example: "João Silva"
 *           minLength: 2
 *           maxLength: 100
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *           example: "joao.silva@email.com"
 *         telefone:
 *           type: string
 *           description: Telefone do usuário
 *           example: "(11) 99999-9999"
 *         avatar:
 *           type: string
 *           description: URL do avatar do usuário
 *           example: "https://example.com/avatar.jpg"
 *         role:
 *           type: string
 *           enum: ["admin", "manager", "operator", "viewer"]
 *           description: Papel do usuário no sistema
 *           example: "operator"
 *         status:
 *           type: string
 *           enum: ["ativo", "inativo", "suspenso"]
 *           description: Status do usuário
 *           example: "ativo"
 *         tipoAcesso:
 *           type: string
 *           enum: ["global", "cliente-especifico"]
 *           description: Tipo de acesso do usuário
 *           example: "cliente-especifico"
 *         clientesVinculados:
 *           type: array
 *           description: Clientes aos quais o usuário tem acesso
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 example: "64a1b2c3d4e5f6789012346"
 *               nome:
 *                 type: string
 *                 example: "Fazenda São José"
 *               email:
 *                 type: string
 *                 example: "contato@fazendaosanjose.com.br"
 *         permissoes:
 *           type: object
 *           description: Permissões específicas do usuário
 *           properties:
 *             areas:
 *               type: object
 *               properties:
 *                 visualizar:
 *                   type: boolean
 *                   example: true
 *                 criar:
 *                   type: boolean
 *                   example: false
 *                 editar:
 *                   type: boolean
 *                   example: false
 *                 excluir:
 *                   type: boolean
 *                   example: false
 *             clientes:
 *               type: object
 *               properties:
 *                 visualizar:
 *                   type: boolean
 *                   example: true
 *                 criar:
 *                   type: boolean
 *                   example: false
 *                 editar:
 *                   type: boolean
 *                   example: false
 *                 excluir:
 *                   type: boolean
 *                   example: false
 *             culturas:
 *               type: object
 *               properties:
 *                 visualizar:
 *                   type: boolean
 *                   example: true
 *                 criar:
 *                   type: boolean
 *                   example: true
 *                 editar:
 *                   type: boolean
 *                   example: true
 *                 excluir:
 *                   type: boolean
 *                   example: false
 *             usuarios:
 *               type: object
 *               properties:
 *                 visualizar:
 *                   type: boolean
 *                   example: false
 *                 criar:
 *                   type: boolean
 *                   example: false
 *                 editar:
 *                   type: boolean
 *                   example: false
 *                 excluir:
 *                   type: boolean
 *                   example: false
 *             relatorios:
 *               type: object
 *               properties:
 *                 visualizar:
 *                   type: boolean
 *                   example: true
 *                 exportar:
 *                   type: boolean
 *                   example: false
 *         ultimoLogin:
 *           type: string
 *           format: date-time
 *           description: Data do último login
 *           example: "2025-01-15T10:30:00Z"
 *         tentativasLogin:
 *           type: number
 *           description: Número de tentativas de login
 *           example: 0
 *         bloqueadoAte:
 *           type: string
 *           format: date-time
 *           description: Data até quando o usuário está bloqueado
 *           example: null
 *         criadoPor:
 *           type: object
 *           description: Usuário que criou este usuário
 *           properties:
 *             _id:
 *               type: string
 *               example: "64a1b2c3d4e5f6789012347"
 *             nome:
 *               type: string
 *               example: "Admin Sistema"
 *             email:
 *               type: string
 *               example: "admin@agrovision.com"
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *           example: "2025-01-15T10:30:00Z"
 *         dataAtualizacao:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *           example: "2025-01-15T10:30:00Z"
 */

export {};
