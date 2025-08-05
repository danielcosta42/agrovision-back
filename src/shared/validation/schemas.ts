import Joi from 'joi';

// Schema para validação de ID do MongoDB
export const mongoIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'ID deve ser um ObjectId válido do MongoDB',
      'any.required': 'ID é obrigatório'
    })
});

// Schema para parâmetros de paginação
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().optional(),
  order: Joi.string().valid('asc', 'desc').default('desc'),
  search: Joi.string().optional()
});

// Schemas para Cliente
export const clienteCreateSchema = Joi.object({
  nome: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 100 caracteres',
      'any.required': 'Nome é obrigatório'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email deve ter um formato válido',
      'any.required': 'Email é obrigatório'
    }),
  
  telefone: Joi.string()
    .required()
    .messages({
      'any.required': 'Telefone é obrigatório'
    }),
  
  documento: Joi.string()
    .required()
    .messages({
      'any.required': 'Documento é obrigatório'
    }),
  
  tipoDocumento: Joi.string()
    .valid('CPF', 'CNPJ')
    .required()
    .messages({
      'any.only': 'Tipo de documento deve ser CPF ou CNPJ',
      'any.required': 'Tipo de documento é obrigatório'
    }),
  
  endereco: Joi.object({
    rua: Joi.string().optional(),
    cidade: Joi.string().optional(),
    estado: Joi.string().optional(),
    cep: Joi.string().optional()
  }).optional(),
  
  status: Joi.string()
    .valid('ativo', 'inativo', 'suspenso')
    .default('ativo')
});

export const clienteUpdateSchema = clienteCreateSchema.fork(
  ['nome', 'email', 'telefone', 'documento', 'tipoDocumento'],
  (schema) => schema.optional()
);

export const clienteQuerySchema = paginationSchema.keys({
  status: Joi.string().valid('ativo', 'inativo', 'suspenso').optional(),
  tipoDocumento: Joi.string().valid('CPF', 'CNPJ').optional(),
  sort: Joi.string().valid('nome', 'email', 'dataCriacao').default('dataCriacao')
});

// Schemas para Área
export const areaCreateSchema = Joi.object({
  nome: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 100 caracteres',
      'any.required': 'Nome é obrigatório'
    }),
  
  descricao: Joi.string()
    .max(500)
    .optional(),
  
  tamanho: Joi.number()
    .positive()
    .required()
    .messages({
      'number.positive': 'Tamanho deve ser um número positivo',
      'any.required': 'Tamanho é obrigatório'
    }),
  
  unidadeMedida: Joi.string()
    .valid('hectares', 'alqueires', 'm²')
    .required()
    .messages({
      'any.only': 'Unidade de medida deve ser hectares, alqueires ou m²',
      'any.required': 'Unidade de medida é obrigatória'
    }),
  
  coordenadas: Joi.object({
    latitude: Joi.number().min(-90).max(90).optional(),
    longitude: Joi.number().min(-180).max(180).optional()
  }).optional(),
  
  clienteId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Cliente ID deve ser um ObjectId válido',
      'any.required': 'Cliente ID é obrigatório'
    }),
  
  status: Joi.string()
    .valid('ativa', 'inativa', 'manutencao')
    .default('ativa')
});

export const areaUpdateSchema = areaCreateSchema.fork(
  ['nome', 'tamanho', 'unidadeMedida', 'clienteId'],
  (schema) => schema.optional()
);

export const areaQuerySchema = paginationSchema.keys({
  clienteId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  status: Joi.string().valid('ativa', 'inativa', 'manutencao').optional(),
  unidadeMedida: Joi.string().valid('hectares', 'alqueires', 'm²').optional(),
  sort: Joi.string().valid('nome', 'tamanho', 'dataCriacao', 'dataAtualizacao').default('dataCriacao')
});

// Schemas para Cultura
export const culturaCreateSchema = Joi.object({
  nome: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 100 caracteres',
      'any.required': 'Nome é obrigatório'
    }),
  
  nomeComum: Joi.string().max(100).optional(),
  nomeCientifico: Joi.string().max(150).optional(),
  
  tipo: Joi.string()
    .valid('graos', 'frutas', 'hortalicas', 'cereais', 'leguminosas', 'oleaginosas', 'outros')
    .required()
    .messages({
      'any.only': 'Tipo deve ser um dos valores válidos',
      'any.required': 'Tipo é obrigatório'
    }),
  
  variedade: Joi.string().max(100).optional(),
  
  cicloVida: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.min': 'Ciclo de vida deve ser pelo menos 1 dia',
      'any.required': 'Ciclo de vida é obrigatório'
    }),
  
  descricao: Joi.string().max(500).optional(),
  
  status: Joi.string()
    .valid('ativa', 'inativa', 'descontinuada')
    .default('ativa')
});

export const culturaUpdateSchema = culturaCreateSchema.fork(
  ['nome', 'tipo', 'cicloVida'],
  (schema) => schema.optional()
);

export const culturaQuerySchema = paginationSchema.keys({
  tipo: Joi.string().valid('graos', 'frutas', 'hortalicas', 'cereais', 'leguminosas', 'oleaginosas', 'outros').optional(),
  status: Joi.string().valid('ativa', 'inativa', 'descontinuada').optional(),
  sort: Joi.string().valid('nome', 'tipo', 'cicloVida', 'dataCriacao').default('dataCriacao')
});

// Schemas para Praga
export const pragaCreateSchema = Joi.object({
  nome: Joi.string()
    .min(2)
    .max(100)
    .required(),
  
  nomeComum: Joi.string().max(100).optional(),
  nomeCientifico: Joi.string().max(150).optional(),
  
  tipo: Joi.string()
    .valid('inseto', 'fungo', 'bacteria', 'virus', 'nematoide', 'erva-daninha', 'outros')
    .required(),
  
  nivelRisco: Joi.string()
    .valid('baixo', 'medio', 'alto', 'critico')
    .required(),
  
  descricao: Joi.string().max(500).optional(),
  
  culturasSuscetiveis: Joi.array()
    .items(Joi.string())
    .optional(),
  
  metodosControle: Joi.array()
    .items(Joi.string())
    .optional(),
  
  status: Joi.string()
    .valid('ativa', 'inativa', 'monitoramento')
    .default('ativa')
});

export const pragaUpdateSchema = pragaCreateSchema.fork(
  ['nome', 'tipo', 'nivelRisco'],
  (schema) => schema.optional()
);

export const pragaQuerySchema = paginationSchema.keys({
  tipo: Joi.string().valid('inseto', 'fungo', 'bacteria', 'virus', 'nematoide', 'erva-daninha', 'outros').optional(),
  nivelRisco: Joi.string().valid('baixo', 'medio', 'alto', 'critico').optional(),
  status: Joi.string().valid('ativa', 'inativa', 'monitoramento').optional(),
  sort: Joi.string().valid('nome', 'tipo', 'nivelRisco', 'dataCriacao').default('dataCriacao')
});

// Schemas para Perda
export const perdaCreateSchema = Joi.object({
  areaId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  
  culturaId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  
  pragaId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional(),
  
  tipoPerda: Joi.string()
    .valid('climatica', 'praga', 'doenca', 'mecanica', 'outros')
    .required(),
  
  quantidade: Joi.number()
    .min(0)
    .required(),
  
  unidadeMedida: Joi.string()
    .valid('kg', 'ton', 'sc', 'percentual')
    .required(),
  
  valorEstimado: Joi.number()
    .min(0)
    .optional(),
  
  dataOcorrencia: Joi.date()
    .required(),
  
  descricao: Joi.string()
    .max(500)
    .optional(),
  
  status: Joi.string()
    .valid('registrada', 'em-analise', 'resolvida', 'irreversivel')
    .default('registrada')
});

export const perdaUpdateSchema = perdaCreateSchema.fork(
  ['areaId', 'culturaId', 'tipoPerda', 'quantidade', 'unidadeMedida', 'dataOcorrencia'],
  (schema) => schema.optional()
);

export const perdaQuerySchema = paginationSchema.keys({
  areaId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  culturaId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  pragaId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  tipoPerda: Joi.string().valid('climatica', 'praga', 'doenca', 'mecanica', 'outros').optional(),
  status: Joi.string().valid('registrada', 'em-analise', 'resolvida', 'irreversivel').optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  sort: Joi.string().valid('dataOcorrencia', 'quantidade', 'valorEstimado', 'dataCriacao').default('dataOcorrencia')
});
