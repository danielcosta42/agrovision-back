export interface CreatePerdaDTO {
  culturaId: string;
  tipo: 'clima' | 'praga' | 'doença' | 'equipamento' | 'outro';
  descricao: string;
  quantidadeAfetada: number;
  valorEstimado: number;
  dataOcorrencia: Date;
  observacoes?: string;
}

export interface UpdatePerdaDTO {
  descricao?: string;
  quantidadeAfetada?: number;
  valorEstimado?: number;
  medidaPreventiva?: string;
  observacoes?: string;
}

export interface PerdaResponseDTO {
  id: string;
  culturaId: string;
  tipo: 'clima' | 'praga' | 'doença' | 'equipamento' | 'outro';
  descricao: string;
  quantidadeAfetada: number;
  valorEstimado: number;
  dataOcorrencia: Date;
  medidaPreventiva?: string;
  observacoes?: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
}
