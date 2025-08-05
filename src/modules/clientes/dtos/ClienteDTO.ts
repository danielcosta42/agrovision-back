export interface CreateClienteDTO {
  nome: string;
  email: string;
  telefone?: string;
  endereco?: {
    rua: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  cnpj?: string;
  cpf?: string;
}

export interface UpdateClienteDTO {
  nome?: string;
  email?: string;
  telefone?: string;
  endereco?: {
    rua: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  cnpj?: string;
  cpf?: string;
}

export interface ClienteResponseDTO {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: {
    rua: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  cnpj?: string;
  cpf?: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
}
