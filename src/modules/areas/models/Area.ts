import mongoose, { Document, Schema } from 'mongoose';

export interface IArea extends Document {
  _id: mongoose.Types.ObjectId;
  nome: string;
  tamanho: number; // em hectares
  localizacao: {
    latitude: number;
    longitude: number;
  };
  clienteId: mongoose.Types.ObjectId;
  tipo: 'irrigada' | 'sequeiro';
  solo: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
  dataExclusao?: Date;
}

const AreaSchema = new Schema<IArea>({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  tamanho: {
    type: Number,
    required: [true, 'Tamanho é obrigatório'],
    min: [0.1, 'Tamanho deve ser maior que 0.1 hectares']
  },
  localizacao: {
    latitude: {
      type: Number,
      required: [true, 'Latitude é obrigatória'],
      min: [-90, 'Latitude deve estar entre -90 e 90'],
      max: [90, 'Latitude deve estar entre -90 e 90']
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude é obrigatória'],
      min: [-180, 'Longitude deve estar entre -180 e 180'],
      max: [180, 'Longitude deve estar entre -180 e 180']
    }
  },
  clienteId: {
    type: Schema.Types.ObjectId,
    ref: 'Cliente',
    required: [true, 'Cliente é obrigatório']
  },
  tipo: {
    type: String,
    required: [true, 'Tipo é obrigatório'],
    enum: {
      values: ['irrigada', 'sequeiro'],
      message: 'Tipo deve ser irrigada ou sequeiro'
    }
  },
  solo: {
    type: String,
    required: [true, 'Tipo de solo é obrigatório'],
    trim: true,
    maxlength: [100, 'Tipo de solo deve ter no máximo 100 caracteres']
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
  collection: 'areas'
});

// Índices
AreaSchema.index({ nome: 1 });
AreaSchema.index({ clienteId: 1 });
AreaSchema.index({ tipo: 1 });
AreaSchema.index({ dataExclusao: 1 });
AreaSchema.index({ 'localizacao.latitude': 1, 'localizacao.longitude': 1 });

// Middleware para atualizar dataAtualizacao
AreaSchema.pre('save', function(next) {
  this.dataAtualizacao = new Date();
  next();
});

// Soft delete - não retornar registros excluídos
AreaSchema.pre(/^find/, function(this: any) {
  this.find({ dataExclusao: { $exists: false } });
});

export const Area = mongoose.model<IArea>('Area', AreaSchema);

// Interface para compatibilidade com o código existente
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
