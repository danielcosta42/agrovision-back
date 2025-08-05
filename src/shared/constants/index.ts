export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const MESSAGES = {
  CLIENT: {
    NOT_FOUND: 'Cliente não encontrado',
    EMAIL_IN_USE: 'Email já está em uso',
    CREATED: 'Cliente criado com sucesso',
    UPDATED: 'Cliente atualizado com sucesso',
    DELETED: 'Cliente removido com sucesso',
  },
  AREA: {
    NOT_FOUND: 'Área não encontrada',
    CREATED: 'Área criada com sucesso',
    UPDATED: 'Área atualizada com sucesso',
    DELETED: 'Área removida com sucesso',
  },
  CULTURA: {
    NOT_FOUND: 'Cultura não encontrada',
    CREATED: 'Cultura criada com sucesso',
    UPDATED: 'Cultura atualizada com sucesso',
    DELETED: 'Cultura removida com sucesso',
  },
  PRAGA: {
    NOT_FOUND: 'Praga não encontrada',
    CREATED: 'Praga registrada com sucesso',
    UPDATED: 'Praga atualizada com sucesso',
    DELETED: 'Praga removida com sucesso',
  },
  PERDA: {
    NOT_FOUND: 'Perda não encontrada',
    CREATED: 'Perda registrada com sucesso',
    UPDATED: 'Perda atualizada com sucesso',
    DELETED: 'Perda removida com sucesso',
  },
  AUTH: {
    TOKEN_NOT_PROVIDED: 'Token não fornecido',
    TOKEN_INVALID: 'Token inválido',
    UNAUTHORIZED: 'Não autorizado',
  },
  SERVER: {
    INTERNAL_ERROR: 'Erro interno do servidor',
  },
} as const;

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  CPF_REGEX: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  CNPJ_REGEX: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
  PHONE_REGEX: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
} as const;
