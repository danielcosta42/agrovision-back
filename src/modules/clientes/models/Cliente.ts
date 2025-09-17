import mongoose, { Document, Schema } from 'mongoose';

export interface ICliente extends Document {
  _id: mongoose.Types.ObjectId;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: {
    rua: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  cpfCnpj?: string;
  responsavel?: string;
  tipoProducao?: string;
  areaTotalHectares?: number;
  observacoes?: string;
  status?: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
  dataExclusao?: Date;
}

const ClienteSchema = new Schema<ICliente>({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  telefone: {
    type: String,
    trim: true,
    maxlength: [20, 'Telefone deve ter no máximo 20 caracteres']
  },
  endereco: {
    rua: {
      type: String,
      trim: true,
      maxlength: [200, 'Rua deve ter no máximo 200 caracteres']
    },
    numero: {
      type: String,
      trim: true,
      maxlength: [20, 'Número deve ter no máximo 20 caracteres']
    },
    complemento: {
      type: String,
      trim: true,
      maxlength: [100, 'Complemento deve ter no máximo 100 caracteres']
    },
    bairro: {
      type: String,
      trim: true,
      maxlength: [100, 'Bairro deve ter no máximo 100 caracteres']
    },
    cidade: {
      type: String,
      trim: true,
      maxlength: [100, 'Cidade deve ter no máximo 100 caracteres']
    },
    estado: {
      type: String,
      trim: true,
      maxlength: [2, 'Estado deve ter no máximo 2 caracteres']
    },
    cep: {
      type: String,
      trim: true,
      maxlength: [10, 'CEP deve ter no máximo 10 caracteres']
    }
  },
  cpfCnpj: {
    type: String,
    required: [true, 'CPF ou CNPJ é obrigatório'],
    trim: true,
    unique: true
  },
  responsavel: {
    type: String,
    trim: true,
    maxlength: [100, 'Responsável deve ter no máximo 100 caracteres']
  },
  tipoProducao: {
    type: String,
    trim: true,
    enum: ['grãos', 'pecuária', 'mista', 'frutas', 'verduras'],
    default: 'grãos'
  },
  areaTotalHectares: {
    type: Number,
    min: [0, 'Área total deve ser maior ou igual a zero']
  },
  observacoes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Observações devem ter no máximo 1000 caracteres']
  },
  status: {
    type: String,
    trim: true,
    enum: ['ativo', 'inativo', 'suspenso'],
    default: 'ativo'
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
  collection: 'clientes'
});

// Índices
ClienteSchema.index({ email: 1 });
ClienteSchema.index({ nome: 1 });
ClienteSchema.index({ cnpj: 1 });
ClienteSchema.index({ cpf: 1 });
ClienteSchema.index({ dataExclusao: 1 });

// Middleware para atualizar dataAtualizacao
ClienteSchema.pre('save', function(next) {
  this.dataAtualizacao = new Date();
  next();
});

// // Soft delete - não retornar registros excluídos
// ClienteSchema.pre(/^find/, function(this: any) {
//   this.find({ dataExclusao: { $exists: false } });
// });

export const Cliente = mongoose.model<ICliente>('Cliente', ClienteSchema);

// Interface para compatibilidade com o código existente
export interface Cliente {
  id?: string;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: {
    rua: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  cpfCnpj?: string;
  responsavel?: string;
  tipoProducao?: string;
  areaTotalHectares?: number;
  observacoes?: string;
  status?: string;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
}
