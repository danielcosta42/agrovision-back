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
}

export interface UpdateAreaDTO {
  nome?: string;
  tamanho?: number;
  localizacao?: {
    latitude: number;
    longitude: number;
  };
  tipo?: 'irrigada' | 'sequeiro';
  solo?: string;
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
  dataCriacao: Date;
  dataAtualizacao: Date;
}
