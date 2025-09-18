export interface Geom {
  type: string;
  coordinates: any;
}

export interface Centroide {
  type: string;
  coordinates: [number, number];
}

export interface CreatePropriedadeDTO {
  clienteId: string;
  nome: string;
  pais: string;
  uf: string;
  municipio: string;
  endereco: string;
  cep: string;
  geom: Geom;
  srid: number;
  area_total_ha: number;
  centroide: Centroide;
  status: string;
  data_inicio_operacao: string;
  regime_posse: string;
  proprietario_exibicao: string;
  contrato_inicio: string;
  contrato_fim: string;
  contrato_identificador: string;
  car: string;
  ccir: string;
  gestor_nome: string;
  gestor_contato: string;
  created_by: string;
  updated_by: string;
}

export interface UpdatePropriedadeDTO extends Partial<CreatePropriedadeDTO> {}

export interface PropriedadeResponseDTO extends CreatePropriedadeDTO {
  id: string;
  created_at: string;
  updated_at: string;
}
