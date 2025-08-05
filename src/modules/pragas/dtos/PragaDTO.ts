export interface CreatePragaDTO {
  nome: string;
  tipo: 'inseto' | 'fungo' | 'doença' | 'erva_daninha';
  gravidade: 'baixa' | 'média' | 'alta';
  culturaId: string;
  dataDeteccao: Date;
  areaAfetada: number;
  observacoes?: string;
}

export interface UpdatePragaDTO {
  nome?: string;
  gravidade?: 'baixa' | 'média' | 'alta';
  areaAfetada?: number;
  tratamentoAplicado?: string;
  dataResolucao?: Date;
  observacoes?: string;
}

export interface PragaResponseDTO {
  id: string;
  nome: string;
  tipo: 'inseto' | 'fungo' | 'doença' | 'erva_daninha';
  gravidade: 'baixa' | 'média' | 'alta';
  culturaId: string;
  dataDeteccao: Date;
  areaAfetada: number;
  tratamentoAplicado?: string;
  dataResolucao?: Date;
  observacoes?: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
}
