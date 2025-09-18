import mongoose, { Document, Schema } from 'mongoose';

export interface IPropriedade extends Document {
  id?: string;
  clienteId: string;
  nome: string;
  pais: string; // ISO 3166-1 alpha-2
  uf: "AC"|"AL"|"AP"|"AM"|"BA"|"CE"|"DF"|"ES"|"GO"|"MA"|"MT"|"MS"|"MG"|"PA"|"PB"|"PR"|"PE"|"PI"|"RJ"|"RN"|"RS"|"RO"|"RR"|"SC"|"SP"|"SE"|"TO";
  municipio: string;
  endereco: string;
  cep: string;
  geom: {
    type: "Polygon"|"MultiPolygon";
    coordinates: any;
  };
  srid: number;
  area_total_ha: number;
  centroide: {
    type: "Point";
    coordinates: [number, number];
  };
  status: "ativa"|"inativa"|"planejada";
  data_inicio_operacao: string; // date
  regime_posse: "propria"|"arrendada"|"parceria";
  proprietario_exibicao: string;
  contrato_inicio?: string; // date, condicional
  contrato_fim?: string; // date, condicional
  contrato_identificador?: string; // condicional
  car: string;
  ccir: string;
  gestor_nome: string;
  gestor_contato: string;
  created_at?: string; // datetime
  updated_at?: string; // datetime
  created_by?: string;
  updated_by?: string;
}

const PropriedadeSchema = new Schema<IPropriedade>({
  clienteId: { type: String, required: true },
  nome: { type: String, required: true },
  pais: { type: String, required: true },
  uf: { type: String, required: true, enum: ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"] },
  municipio: { type: String, required: true },
  endereco: { type: String, required: true },
  cep: { type: String, required: true },
  geom: {
    type: { type: String, required: true, enum: ["Polygon","MultiPolygon"] },
    coordinates: { type: Array, required: true },
  },
  srid: { type: Number, required: true },
  area_total_ha: { type: Number, required: true },
  centroide: {
    type: { type: String, required: true, enum: ["Point"] },
    coordinates: { type: [Number], required: true },
  },
  status: { type: String, required: true, enum: ["ativa","inativa","planejada"] },
  data_inicio_operacao: { type: String, required: true },
  regime_posse: { type: String, required: true, enum: ["propria","arrendada","parceria"] },
  proprietario_exibicao: { type: String, required: true },
  contrato_inicio: { type: String, required: false },
  contrato_fim: { type: String, required: false },
  contrato_identificador: { type: String, required: false },
  car: { type: String, required: true },
  ccir: { type: String, required: true },
  gestor_nome: { type: String, required: true },
  gestor_contato: { type: String, required: true },
  created_at: { type: String, required: false },
  updated_at: { type: String, required: false },
  created_by: { type: String, required: false },
  updated_by: { type: String, required: false },
}, {
  collection: 'propriedades',
});

export const Propriedade = mongoose.model<IPropriedade>('Propriedade', PropriedadeSchema);
