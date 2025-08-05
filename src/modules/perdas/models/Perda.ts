import mongoose, { Document, Schema } from 'mongoose';

export interface IPerda extends Document {
  _id: mongoose.Types.ObjectId;
  culturaId: mongoose.Types.ObjectId;
  tipo: 'clima' | 'praga' | 'doença' | 'equipamento' | 'outro';
  descricao: string;
  quantidadeAfetada: number; // em kg ou hectares
  valorEstimado: number; // em reais
  dataOcorrencia: Date;
  medidaPreventiva?: string;
  observacoes?: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
  dataExclusao?: Date;
}

const PerdaSchema = new Schema<IPerda>({
  culturaId: {
    type: Schema.Types.ObjectId,
    ref: 'Cultura',
    required: [true, 'Cultura é obrigatória']
  },
  tipo: {
    type: String,
    required: [true, 'Tipo é obrigatório'],
    enum: {
      values: ['clima', 'praga', 'doença', 'equipamento', 'outro'],
      message: 'Tipo deve ser clima, praga, doença, equipamento ou outro'
    }
  },
  descricao: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    trim: true,
    maxlength: [500, 'Descrição deve ter no máximo 500 caracteres']
  },
  quantidadeAfetada: {
    type: Number,
    required: [true, 'Quantidade afetada é obrigatória'],
    min: [0, 'Quantidade afetada deve ser maior que 0']
  },
  valorEstimado: {
    type: Number,
    required: [true, 'Valor estimado é obrigatório'],
    min: [0, 'Valor estimado deve ser maior que 0']
  },
  dataOcorrencia: {
    type: Date,
    required: [true, 'Data de ocorrência é obrigatória']
  },
  medidaPreventiva: {
    type: String,
    trim: true,
    maxlength: [500, 'Medida preventiva deve ter no máximo 500 caracteres']
  },
  observacoes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Observações devem ter no máximo 1000 caracteres']
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  },
  dataAtualizacao: {
    type: Date,
    default: Date.now
  },
  dataExclusao: {
    type: Date
  }
}, {
  timestamps: { createdAt: 'dataCriacao', updatedAt: 'dataAtualizacao' },
  collection: 'perdas'
});

// Índices
PerdaSchema.index({ culturaId: 1 });
PerdaSchema.index({ tipo: 1 });
PerdaSchema.index({ dataOcorrencia: 1 });
PerdaSchema.index({ valorEstimado: 1 });
PerdaSchema.index({ dataExclusao: 1 });

// Middleware para atualizar dataAtualizacao
PerdaSchema.pre('save', function(next) {
  this.dataAtualizacao = new Date();
  next();
});

// Soft delete - não retornar registros excluídos
PerdaSchema.pre(/^find/, function(this: any) {
  this.find({ dataExclusao: { $exists: false } });
});

export const Perda = mongoose.model<IPerda>('Perda', PerdaSchema);

// Interface para compatibilidade com o código existente
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
