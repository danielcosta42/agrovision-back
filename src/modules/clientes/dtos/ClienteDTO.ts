export interface CreateClienteDTO {
  nome: string;
  email: string;
  telefone?: string;
  endereco?: {
    rua: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  cpfCnpj?: string;
  responsavel?: string;
  tipoProducao?: string;
  areaTotalHectares?: number;
  observacoes?: string;
  status?: string;
}

export interface UpdateClienteDTO {
  nome?: string;
  email?: string;
  telefone?: string;
  endereco?: {
    rua: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  };
  cpfCnpj?: string;
  responsavel?: string;
  tipoProducao?: string;
  areaTotalHectares?: number;
  observacoes?: string;
  status?: string;
}

export interface ClienteResponseDTO {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: {
    rua: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  cpfCnpj?: string;
  responsavel?: string;
  tipoProducao?: string;
  areaTotalHectares?: number;
  observacoes?: string;
  status?: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
}
