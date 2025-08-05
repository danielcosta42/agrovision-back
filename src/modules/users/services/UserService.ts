import { User, IUser } from '../models/User';
import { Types } from 'mongoose';

interface CreateUserData {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  role: 'admin' | 'manager' | 'operator' | 'viewer';
  tipoAcesso: 'global' | 'cliente-especifico';
  clientesVinculados?: string[];
  permissoes?: any;
  criadoPor?: string;
}

interface UpdateUserData {
  nome?: string;
  email?: string;
  telefone?: string;
  role?: 'admin' | 'manager' | 'operator' | 'viewer';
  status?: 'ativo' | 'inativo' | 'suspenso';
  tipoAcesso?: 'global' | 'cliente-especifico';
  clientesVinculados?: string[];
  permissoes?: any;
}

interface ListUsersFilters {
  search?: string;
  role?: string;
  status?: string;
  tipoAcesso?: string;
  clienteId?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export class UserService {
  
  async create(userData: CreateUserData): Promise<IUser> {
    // Verificar se email já existe
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    // Definir permissões baseadas no role
    const permissoes = userData.permissoes || this.getDefaultPermissions(userData.role);

    const user = new User({
      ...userData,
      permissoes,
      clientesVinculados: userData.clientesVinculados?.map(id => new Types.ObjectId(id))
    });

    return await user.save();
  }

  async findAll(filters: ListUsersFilters = {}) {
    const {
      search = '',
      role,
      status,
      tipoAcesso,
      clienteId,
      page = 1,
      limit = 10,
      sort = 'dataCriacao',
      order = 'desc'
    } = filters;

    const query: any = {};

    // Filtro de busca
    if (search) {
      query.$or = [
        { nome: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Filtros específicos
    if (role) query.role = role;
    if (status) query.status = status;
    if (tipoAcesso) query.tipoAcesso = tipoAcesso;
    if (clienteId) query.clientesVinculados = new Types.ObjectId(clienteId);

    const sortOrder = order === 'desc' ? -1 : 1;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query)
        .populate('clientesVinculados', 'nome email')
        .populate('criadoPor', 'nome email')
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(limit)
        .select('-senha'),
      User.countDocuments(query)
    ]);

    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async findById(id: string): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID inválido');
    }

    return await User.findById(id)
      .populate('clientesVinculados', 'nome email')
      .populate('criadoPor', 'nome email')
      .select('-senha') as IUser | null;
  }

  async findByEmail(email: string, includePassword: boolean = false): Promise<IUser | null> {
    let query = User.findOne({ email: email.toLowerCase() });
    
    if (includePassword) {
      query = query.select('+senha');
    }
    
    return await query.exec();
  }

  async update(id: string, updateData: UpdateUserData): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID inválido');
    }

    // Se está mudando email, verificar se não existe
    if (updateData.email) {
      const existingUser = await User.findOne({ 
        email: updateData.email, 
        _id: { $ne: id } 
      });
      if (existingUser) {
        throw new Error('Email já está em uso');
      }
    }

    const updatePayload: any = { ...updateData };
    
    if (updateData.clientesVinculados) {
      updatePayload.clientesVinculados = updateData.clientesVinculados.map(
        id => new Types.ObjectId(id)
      );
    }

    return await User.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    )
    .populate('clientesVinculados', 'nome email')
    .populate('criadoPor', 'nome email')
    .select('-senha') as IUser | null;
  }

  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID inválido');
    }

    const result = await User.findByIdAndUpdate(
      id,
      { dataExclusao: new Date() },
      { new: true }
    );

    return !!result;
  }

  async changePassword(id: string, novaSenha: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID inválido');
    }

    const user = await User.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    user.senha = novaSenha;
    await user.save();

    return true;
  }

  async updateLoginAttempts(id: string, success: boolean): Promise<void> {
    const user = await User.findById(id);
    if (!user) return;

    if (success) {
      user.ultimoLogin = new Date();
      user.tentativasLogin = 0;
      user.bloqueadoAte = undefined;
    } else {
      user.tentativasLogin += 1;
      
      // Bloquear após 5 tentativas
      if (user.tentativasLogin >= 5) {
        user.bloqueadoAte = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
      }
    }

    await user.save();
  }

  async getUsersForCliente(clienteId: string) {
    if (!Types.ObjectId.isValid(clienteId)) {
      throw new Error('ID do cliente inválido');
    }

    return await User.find({
      $or: [
        { tipoAcesso: 'global' },
        { clientesVinculados: new Types.ObjectId(clienteId) }
      ],
      status: 'ativo'
    })
    .select('-senha')
    .populate('criadoPor', 'nome email');
  }

  async assignClientesToUser(userId: string, clienteIds: string[]): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('ID do usuário inválido');
    }

    const objectIds = clienteIds.map(id => {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error(`ID do cliente inválido: ${id}`);
      }
      return new Types.ObjectId(id);
    });

    return await User.findByIdAndUpdate(
      userId,
      { clientesVinculados: objectIds },
      { new: true, runValidators: true }
    )
    .populate('clientesVinculados', 'nome email')
    .select('-senha') as IUser | null;
  }

  private getDefaultPermissions(role: string) {
    const basePermissions = {
      areas: { visualizar: false, criar: false, editar: false, excluir: false },
      clientes: { visualizar: false, criar: false, editar: false, excluir: false },
      culturas: { visualizar: false, criar: false, editar: false, excluir: false },
      usuarios: { visualizar: false, criar: false, editar: false, excluir: false },
      relatorios: { visualizar: false, exportar: false }
    };

    switch (role) {
      case 'admin':
        return {
          areas: { visualizar: true, criar: true, editar: true, excluir: true },
          clientes: { visualizar: true, criar: true, editar: true, excluir: true },
          culturas: { visualizar: true, criar: true, editar: true, excluir: true },
          usuarios: { visualizar: true, criar: true, editar: true, excluir: true },
          relatorios: { visualizar: true, exportar: true }
        };
      
      case 'manager':
        return {
          areas: { visualizar: true, criar: true, editar: true, excluir: false },
          clientes: { visualizar: true, criar: true, editar: true, excluir: false },
          culturas: { visualizar: true, criar: true, editar: true, excluir: false },
          usuarios: { visualizar: true, criar: false, editar: false, excluir: false },
          relatorios: { visualizar: true, exportar: true }
        };
      
      case 'operator':
        return {
          areas: { visualizar: true, criar: true, editar: true, excluir: false },
          clientes: { visualizar: true, criar: false, editar: false, excluir: false },
          culturas: { visualizar: true, criar: true, editar: true, excluir: false },
          usuarios: { visualizar: false, criar: false, editar: false, excluir: false },
          relatorios: { visualizar: true, exportar: false }
        };
      
      case 'viewer':
      default:
        return {
          areas: { visualizar: true, criar: false, editar: false, excluir: false },
          clientes: { visualizar: true, criar: false, editar: false, excluir: false },
          culturas: { visualizar: true, criar: false, editar: false, excluir: false },
          usuarios: { visualizar: false, criar: false, editar: false, excluir: false },
          relatorios: { visualizar: true, exportar: false }
        };
    }
  }

  // Métodos para autenticação
  async findByIdWithPassword(id: string): Promise<IUser | null> {
    return await User.findById(id).select('+senha').exec();
  }

  async incrementarTentativasLogin(userId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) return;

    user.tentativasLogin = (user.tentativasLogin || 0) + 1;
    
    // Bloquear após 5 tentativas por 30 minutos
    if (user.tentativasLogin >= 5) {
      user.bloqueadoAte = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
    }
    
    await user.save();
  }

  async resetarTentativasLogin(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      tentativasLogin: 0,
      $unset: { bloqueadoAte: 1 }
    });
  }

  async atualizarUltimoLogin(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      ultimoLogin: new Date()
    });
  }

  async updatePassword(userId: string, novaSenha: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    user.senha = novaSenha;
    await user.save();
  }
}
