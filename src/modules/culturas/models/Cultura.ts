export interface Cultura {
  id?: string;
  nome: string;
  variedade: string;
  areaId: string;
  dataPlantio: Date;
  dataColheita?: Date;
  estadoAtual: 'plantada' | 'crescimento' | 'floração' | 'colhida';
  produtividade?: number; // em kg/hectare
  observacoes?: string;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
}
