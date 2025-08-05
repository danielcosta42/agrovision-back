import mongoose, { Document, Schema } from 'mongoose';

export interface IPraga extends Document {
  _id: mongoose.Types.ObjectId;
  nome: string;
  tipo: 'inseto' | 'fungo' | 'doença' | 'erva_daninha';
  gravidade: 'baixa' | 'média' | 'alta';
  culturaId: mongoose.Types.ObjectId;
  dataDeteccao: Date;
  areaAfetada: number; // em hectares
  tratamentoAplicado?: string;
  dataResolucao?: Date;
  observacoes?: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
  dataExclusao?: Date;
}

const PragaSchema = new Schema<IPraga>({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  tipo: {
    type: String,
    required: [true, 'Tipo é obrigatório'],
    enum: {
      values: ['inseto', 'fungo', 'doença', 'erva_daninha'],
      message: 'Tipo deve ser inseto, fungo, doença ou erva_daninha'
    }
  },
  gravidade: {
    type: String,
    required: [true, 'Gravidade é obrigatória'],
    enum: {
      values: ['baixa', 'média', 'alta'],
      message: 'Gravidade deve ser baixa, média ou alta'
    }
  },
  culturaId: {
    type: Schema.Types.ObjectId,
    ref: 'Cultura',
    required: [true, 'Cultura é obrigatória']
  },
  dataDeteccao: {
    type: Date,
    required: [true, 'Data de detecção é obrigatória']
  },
  areaAfetada: {
    type: Number,
    required: [true, 'Área afetada é obrigatória'],
    min: [0, 'Área afetada deve ser maior que 0']
  },
  tratamentoAplicado: {
    type: String,
    trim: true,
    maxlength: [500, 'Tratamento aplicado deve ter no máximo 500 caracteres']
  },
  dataResolucao: {
    type: Date
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
  collection: 'pragas'
});

// Índices
PragaSchema.index({ nome: 1 });
PragaSchema.index({ tipo: 1 });
PragaSchema.index({ gravidade: 1 });
PragaSchema.index({ culturaId: 1 });
PragaSchema.index({ dataDeteccao: 1 });
PragaSchema.index({ dataResolucao: 1 });
PragaSchema.index({ dataExclusao: 1 });

// Middleware para atualizar dataAtualizacao
PragaSchema.pre('save', function(next) {
  this.dataAtualizacao = new Date();
  next();
});

// Soft delete - não retornar registros excluídos
PragaSchema.pre(/^find/, function(this: any) {
  this.find({ dataExclusao: { $exists: false } });
});

// Validação personalizada para data de resolução
PragaSchema.pre('save', function(next) {
  if (this.dataResolucao && this.dataResolucao < this.dataDeteccao) {
    const error = new Error('Data de resolução deve ser posterior à data de detecção');
    return next(error);
  }
  next();
});

export const Praga = mongoose.model<IPraga>('Praga', PragaSchema);

// Interface para compatibilidade com o código existente
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
