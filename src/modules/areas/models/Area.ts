export interface Area {
  id?: string;
  nome: string;
  tamanho: number; // em hectares
  localizacao: {
    latitude: number;
    longitude: number;
  };
  clienteId: string;
  tipo: 'irrigada' | 'sequeiro';
  solo: string;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
}
