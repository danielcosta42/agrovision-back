import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Enums e tipos
export enum Role {
  ADMIN = 'admin',
  MANAGER = 'manager',
  OPERATOR = 'operator',
  VIEWER = 'viewer'
}

export enum UserStatus {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  SUSPENSO = 'suspenso'
}

export enum AccessType {
  GLOBAL = 'global',
  CLIENT_SPECIFIC = 'cliente-especifico'
}

export interface IUser extends Document {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'operator' | 'viewer';
  status: 'ativo' | 'inativo' | 'suspenso';
  
  // Controle de acesso por cliente
  tipoAcesso: 'global' | 'cliente-especifico';
  clientesVinculados: mongoose.Types.ObjectId[]; // IDs dos clientes que pode acessar
  
  // Permissões específicas
  permissoes: {
    areas: {
      visualizar: boolean;
      criar: boolean;
      editar: boolean;
      excluir: boolean;
    };
    clientes: {
      visualizar: boolean;
      criar: boolean;
      editar: boolean;
      excluir: boolean;
    };
    culturas: {
      visualizar: boolean;
      criar: boolean;
      editar: boolean;
      excluir: boolean;
    };
    usuarios: {
      visualizar: boolean;
      criar: boolean;
      editar: boolean;
      excluir: boolean;
    };
    relatorios: {
      visualizar: boolean;
      exportar: boolean;
    };
  };
  
  // Dados de auditoria
  ultimoLogin?: Date;
  tentativasLogin: number;
  bloqueadoAte?: Date;
  criadoPor?: mongoose.Types.ObjectId;
  
  dataCriacao: Date;
  dataAtualizacao: Date;
  dataExclusao?: Date;
  
  // Métodos
  compararSenha(senha: string): Promise<boolean>;
  podeAcessarCliente(clienteId: string): boolean;
  temPermissao(recurso: string, acao: string): boolean;
}

const permissoesDefault = {
  areas: { visualizar: false, criar: false, editar: false, excluir: false },
  clientes: { visualizar: false, criar: false, editar: false, excluir: false },
  culturas: { visualizar: false, criar: false, editar: false, excluir: false },
  usuarios: { visualizar: false, criar: false, editar: false, excluir: false },
  relatorios: { visualizar: false, exportar: false }
};

const UserSchema = new Schema<IUser>({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    minlength: [2, 'Nome deve ter pelo menos 2 caracteres'],
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
  
  senha: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter pelo menos 6 caracteres'],
    select: false
  },
  
  telefone: {
    type: String,
    trim: true
  },
  
  avatar: {
    type: String
  },
  
  role: {
    type: String,
    enum: ['admin', 'manager', 'operator', 'viewer'],
    default: 'viewer',
    required: true
  },
  
  status: {
    type: String,
    enum: ['ativo', 'inativo', 'suspenso'],
    default: 'ativo',
    required: true
  },
  
  tipoAcesso: {
    type: String,
    enum: ['global', 'cliente-especifico'],
    default: 'cliente-especifico',
    required: true
  },
  
  clientesVinculados: [{
    type: Schema.Types.ObjectId,
    ref: 'Cliente'
  }],
  
  permissoes: {
    type: {
      areas: {
        visualizar: { type: Boolean, default: false },
        criar: { type: Boolean, default: false },
        editar: { type: Boolean, default: false },
        excluir: { type: Boolean, default: false }
      },
      clientes: {
        visualizar: { type: Boolean, default: false },
        criar: { type: Boolean, default: false },
        editar: { type: Boolean, default: false },
        excluir: { type: Boolean, default: false }
      },
      culturas: {
        visualizar: { type: Boolean, default: false },
        criar: { type: Boolean, default: false },
        editar: { type: Boolean, default: false },
        excluir: { type: Boolean, default: false }
      },
      usuarios: {
        visualizar: { type: Boolean, default: false },
        criar: { type: Boolean, default: false },
        editar: { type: Boolean, default: false },
        excluir: { type: Boolean, default: false }
      },
      relatorios: {
        visualizar: { type: Boolean, default: false },
        exportar: { type: Boolean, default: false }
      }
    },
    default: () => permissoesDefault
  },
  
  ultimoLogin: Date,
  
  tentativasLogin: {
    type: Number,
    default: 0
  },
  
  bloqueadoAte: Date,
  
  criadoPor: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  dataCriacao: {
    type: Date,
    default: Date.now
  },
  
  dataAtualizacao: {
    type: Date,
    default: Date.now
  },
  
  dataExclusao: Date
}, {
  timestamps: { createdAt: 'dataCriacao', updatedAt: 'dataAtualizacao' }
});

// Índices
UserSchema.index({ email: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ tipoAcesso: 1 });
UserSchema.index({ clientesVinculados: 1 });
UserSchema.index({ dataExclusao: 1 });

// Hook para hash da senha antes de salvar
UserSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Método para comparar senha
UserSchema.methods.compararSenha = async function(senha: string): Promise<boolean> {
  return bcrypt.compare(senha, this.senha);
};

// Método para verificar se pode acessar cliente
UserSchema.methods.podeAcessarCliente = function(clienteId: string): boolean {
  if (this.tipoAcesso === 'global') return true;
  return this.clientesVinculados.some((id: mongoose.Types.ObjectId) => 
    id.toString() === clienteId
  );
};

// Método para verificar permissões
UserSchema.methods.temPermissao = function(recurso: string, acao: string): boolean {
  if (this.role === 'admin') return true;
  
  const permissaoRecurso = this.permissoes[recurso];
  if (!permissaoRecurso) return false;
  
  return permissaoRecurso[acao] || false;
};

// Middleware para soft delete
UserSchema.pre(/^find/, function(this: any) {
  this.where({ dataExclusao: { $exists: false } });
});

export const User = mongoose.model<IUser>('User', UserSchema);
