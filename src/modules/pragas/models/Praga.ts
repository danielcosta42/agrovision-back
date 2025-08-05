export interface Praga {
  id?: string;
  nome: string;
  tipo: 'inseto' | 'fungo' | 'doença' | 'erva_daninha';
  gravidade: 'baixa' | 'média' | 'alta';
  culturaId: string;
  dataDeteccao: Date;
  areaAfetada: number; // em hectares
  tratamentoAplicado?: string;
  dataResolucao?: Date;
  observacoes?: string;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
}
