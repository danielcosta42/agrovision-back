
export interface CreateAreaDTO {
  nome: string;
  tamanho: number;
  localizacao: {
    latitude: number;
    longitude: number;
  };
  clienteId: string;
  tipo: 'irrigada' | 'sequeiro';
  solo: string;
  // Campos opcionais do formulário
  culturaAtual?: string;
  statusCultivo?: string;
  dataPlantio?: string;
  previsaoColheita?: string;
  produtividadeEstimada?: string;
  irrigacao?: boolean;
  declive?: string;
  tipoSolo?: string;
  phSolo?: string;
  fertilizantes?: string;
  historicoCulturas?: string;
  observacoes?: string;
}


export interface UpdateAreaDTO {
  nome?: string;
  tamanho?: number;
  localizacao?: {
    latitude: number;
    longitude: number;
  };
  clienteId?: string;
  tipo?: 'irrigada' | 'sequeiro';
  solo?: string;
  culturaAtual?: string;
  statusCultivo?: string;
  dataPlantio?: string;
  previsaoColheita?: string;
  produtividadeEstimada?: string;
  irrigacao?: boolean;
  declive?: string;
  tipoSolo?: string;
  phSolo?: string;
  fertilizantes?: string;
  historicoCulturas?: string;
  observacoes?: string;
}


export interface AreaResponseDTO {
  id: string;
  nome: string;
  tamanho: number;
  localizacao: {
    latitude: number;
    longitude: number;
  };
  clienteId: string;
  tipo: 'irrigada' | 'sequeiro';
  solo: string;
  culturaAtual?: string;
  statusCultivo?: string;
  dataPlantio?: string;
  previsaoColheita?: string;
  produtividadeEstimada?: string;
  irrigacao?: boolean;
  declive?: string;
  tipoSolo?: string;
  phSolo?: string;
  fertilizantes?: string;
  historicoCulturas?: string;
  observacoes?: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
}
