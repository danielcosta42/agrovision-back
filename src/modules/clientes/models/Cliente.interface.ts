export interface Cliente {
  id?: string;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: {
    rua: string;
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
  dataCriacao?: Date;
  dataAtualizacao?: Date;
}
