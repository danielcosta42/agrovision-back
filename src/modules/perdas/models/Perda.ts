export interface Perda {
  id?: string;
  culturaId: string;
  tipo: 'clima' | 'praga' | 'doença' | 'equipamento' | 'outro';
  descricao: string;
  quantidadeAfetada: number; // em kg ou hectares
  valorEstimado: number; // em reais
  dataOcorrencia: Date;
  medidaPreventiva?: string;
  observacoes?: string;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
}
