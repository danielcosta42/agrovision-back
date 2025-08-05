export interface CreateCulturaDTO {
  nome: string;
  variedade: string;
  areaId: string;
  dataPlantio: Date;
  dataColheita?: Date;
  estadoAtual: 'plantada' | 'crescimento' | 'floração' | 'colhida';
  observacoes?: string;
}

export interface UpdateCulturaDTO {
  nome?: string;
  variedade?: string;
  dataColheita?: Date;
  estadoAtual?: 'plantada' | 'crescimento' | 'floração' | 'colhida';
  produtividade?: number;
  observacoes?: string;
}

export interface CulturaResponseDTO {
  id: string;
  nome: string;
  variedade: string;
  areaId: string;
  dataPlantio: Date;
  dataColheita?: Date;
  estadoAtual: 'plantada' | 'crescimento' | 'floração' | 'colhida';
  produtividade?: number;
  observacoes?: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
}
