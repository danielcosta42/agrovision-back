import mongoose, { Document, Schema } from 'mongoose';

export interface ICultura extends Document {
  _id: mongoose.Types.ObjectId;
  nome: string;
  variedade: string;
  areaId: mongoose.Types.ObjectId;
  dataPlantio: Date;
  dataColheita?: Date;
  estadoAtual: 'plantada' | 'crescimento' | 'floração' | 'colhida';
  produtividade?: number; // em kg/hectare
  observacoes?: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
  dataExclusao?: Date;
}

const CulturaSchema = new Schema<ICultura>({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  variedade: {
    type: String,
    required: [true, 'Variedade é obrigatória'],
    trim: true,
    maxlength: [100, 'Variedade deve ter no máximo 100 caracteres']
  },
  areaId: {
    type: Schema.Types.ObjectId,
    ref: 'Area',
    required: [true, 'Área é obrigatória']
  },
  dataPlantio: {
    type: Date,
    required: [true, 'Data de plantio é obrigatória']
  },
  dataColheita: {
    type: Date
  },
  estadoAtual: {
    type: String,
    required: [true, 'Estado atual é obrigatório'],
    enum: {
      values: ['plantada', 'crescimento', 'floração', 'colhida'],
      message: 'Estado deve ser plantada, crescimento, floração ou colhida'
    },
    default: 'plantada'
  },
  produtividade: {
    type: Number,
    min: [0, 'Produtividade deve ser maior que 0']
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
  collection: 'culturas'
});

// Índices
CulturaSchema.index({ nome: 1 });
CulturaSchema.index({ areaId: 1 });
CulturaSchema.index({ estadoAtual: 1 });
CulturaSchema.index({ dataPlantio: 1 });
CulturaSchema.index({ dataColheita: 1 });
CulturaSchema.index({ dataExclusao: 1 });

// Middleware para atualizar dataAtualizacao
CulturaSchema.pre('save', function(next) {
  this.dataAtualizacao = new Date();
  next();
});

// Soft delete - não retornar registros excluídos
CulturaSchema.pre(/^find/, function(this: any) {
  this.find({ dataExclusao: { $exists: false } });
});

// Validação personalizada para data de colheita
CulturaSchema.pre('save', function(next) {
  if (this.dataColheita && this.dataColheita < this.dataPlantio) {
    const error = new Error('Data de colheita deve ser posterior à data de plantio');
    return next(error);
  }
  next();
});

export const Cultura = mongoose.model<ICultura>('Cultura', CulturaSchema);

// Interface para compatibilidade com o código existente
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
