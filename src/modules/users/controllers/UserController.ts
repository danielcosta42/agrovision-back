import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { AppError } from '../../../shared/errors/AppError';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    tipoAcesso: string;
    clientesVinculados: string[];
  };
}

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async index(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const currentUser = req.user;
      if (!currentUser) {
        throw new AppError('Usuário não autenticado', 401);
      }

      // Verificar se pode visualizar usuários
      if (currentUser.role !== 'admin' && !this.hasPermission(currentUser, 'usuarios', 'visualizar')) {
        throw new AppError('Sem permissão para visualizar usuários', 403);
      }

      const {
        search,
        role,
        status,
        tipoAcesso,
        clienteId,
        page = '1',
        limit = '10',
        sort = 'dataCriacao',
        order = 'desc'
      } = req.query;

      let filters: any = {
        search: search as string,
        role: role as string,
        status: status as string,
        tipoAcesso: tipoAcesso as string,
        clienteId: clienteId as string,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sort: sort as string,
        order: order as 'asc' | 'desc'
      };

      // Se não é admin global, filtrar por clientes vinculados
      if (currentUser.tipoAcesso !== 'global' && currentUser.role !== 'admin') {
        if (!filters.clienteId) {
          // Se não especificou cliente, mostrar apenas usuários dos seus clientes
          const result = await this.userService.findAll({
            ...filters,
            clienteId: currentUser.clientesVinculados[0] // Pegar primeiro cliente vinculado
          });
          res.json(result);
          return;
        }

        // Verificar se tem acesso ao cliente especificado
        if (!currentUser.clientesVinculados.includes(filters.clienteId)) {
          throw new AppError('Sem permissão para visualizar usuários deste cliente', 403);
        }
      }

      const result = await this.userService.findAll(filters);
      res.json(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Erro interno do servidor' });
      }
    }
  }

  async show(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const currentUser = req.user;

      if (!currentUser) {
        throw new AppError('Usuário não autenticado', 401);
      }

      const user = await this.userService.findById(id);
      if (!user) {
        throw new AppError('Usuário não encontrado', 404);
      }

      // Verificar permissões de acesso
      if (!this.canAccessUser(currentUser, user)) {
        throw new AppError('Sem permissão para visualizar este usuário', 403);
      }

      res.json(user);
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Erro interno do servidor' });
      }
    }
  }

  async store(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const currentUser = req.user;
      if (!currentUser) {
        throw new AppError('Usuário não autenticado', 401);
      }

      // Verificar permissão para criar usuários
      if (!this.hasPermission(currentUser, 'usuarios', 'criar')) {
        throw new AppError('Sem permissão para criar usuários', 403);
      }

      const {
        nome,
        email,
        senha,
        telefone,
        role,
        tipoAcesso,
        clientesVinculados,
        permissoes
      } = req.body;

      // Validações básicas
      if (!nome || !email || !senha) {
        throw new AppError('Nome, email e senha são obrigatórios', 400);
      }

      // Verificar se pode criar usuário com o role especificado
      if (!this.canCreateUserWithRole(currentUser, role)) {
        throw new AppError('Sem permissão para criar usuário com este papel', 403);
      }

      // Se não é admin global, limitar acesso aos clientes
      let finalClientesVinculados = clientesVinculados;
      if (currentUser.tipoAcesso !== 'global' && currentUser.role !== 'admin') {
        // Só pode vincular aos seus próprios clientes
        finalClientesVinculados = clientesVinculados?.filter((clienteId: string) =>
          currentUser.clientesVinculados.includes(clienteId)
        ) || [];
      }

      const userData = {
        nome,
        email,
        senha,
        telefone,
        role: role || 'viewer',
        tipoAcesso: tipoAcesso || 'cliente-especifico',
        clientesVinculados: finalClientesVinculados,
        permissoes,
        criadoPor: currentUser.id
      };

      const user = await this.userService.create(userData);
      res.status(201).json(user);
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else if (error.message === 'Email já está em uso') {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Erro interno do servidor' });
      }
    }
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const currentUser = req.user;

      if (!currentUser) {
        throw new AppError('Usuário não autenticado', 401);
      }

      const existingUser = await this.userService.findById(id);
      if (!existingUser) {
        throw new AppError('Usuário não encontrado', 404);
      }

      // Verificar permissões
      if (!this.canModifyUser(currentUser, existingUser)) {
        throw new AppError('Sem permissão para editar este usuário', 403);
      }

      const {
        nome,
        email,
        telefone,
        role,
        status,
        tipoAcesso,
        clientesVinculados,
        permissoes
      } = req.body;

      // Verificar se pode alterar role
      if (role && !this.canCreateUserWithRole(currentUser, role)) {
        throw new AppError('Sem permissão para atribuir este papel', 403);
      }

      let finalClientesVinculados = clientesVinculados;
      if (currentUser.tipoAcesso !== 'global' && currentUser.role !== 'admin') {
        finalClientesVinculados = clientesVinculados?.filter((clienteId: string) =>
          currentUser.clientesVinculados.includes(clienteId)
        );
      }

      const updateData = {
        nome,
        email,
        telefone,
        role,
        status,
        tipoAcesso,
        clientesVinculados: finalClientesVinculados,
        permissoes
      };

      const user = await this.userService.update(id, updateData);
      res.json(user);
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else if (error.message === 'Email já está em uso') {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Erro interno do servidor' });
      }
    }
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const currentUser = req.user;

      if (!currentUser) {
        throw new AppError('Usuário não autenticado', 401);
      }

      // Não pode excluir a si mesmo
      if (id === currentUser.id) {
        throw new AppError('Não é possível excluir seu próprio usuário', 400);
      }

      const existingUser = await this.userService.findById(id);
      if (!existingUser) {
        throw new AppError('Usuário não encontrado', 404);
      }

      if (!this.canModifyUser(currentUser, existingUser)) {
        throw new AppError('Sem permissão para excluir este usuário', 403);
      }

      await this.userService.delete(id);
      res.json({ message: 'Usuário excluído com sucesso' });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Erro interno do servidor' });
      }
    }
  }

  async changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { novaSenha } = req.body;
      const currentUser = req.user;

      if (!currentUser) {
        throw new AppError('Usuário não autenticado', 401);
      }

      if (!novaSenha) {
        throw new AppError('Nova senha é obrigatória', 400);
      }

      // Pode alterar própria senha ou se tem permissão
      if (id !== currentUser.id && !this.hasPermission(currentUser, 'usuarios', 'editar')) {
        throw new AppError('Sem permissão para alterar senha deste usuário', 403);
      }

      await this.userService.changePassword(id, novaSenha);
      res.json({ message: 'Senha alterada com sucesso' });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Erro interno do servidor' });
      }
    }
  }

  async getUsersByClient(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { clienteId } = req.params;
      const currentUser = req.user;

      if (!currentUser) {
        throw new AppError('Usuário não autenticado', 401);
      }

      // Verificar se pode acessar usuários deste cliente
      if (currentUser.tipoAcesso !== 'global' && 
          !currentUser.clientesVinculados.includes(clienteId)) {
        throw new AppError('Sem permissão para acessar usuários deste cliente', 403);
      }

      const users = await this.userService.getUsersForCliente(clienteId);
      res.json(users);
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Erro interno do servidor' });
      }
    }
  }

  private hasPermission(user: any, recurso: string, acao: string): boolean {
    if (user.role === 'admin') return true;
    return user.permissoes?.[recurso]?.[acao] || false;
  }

  private canAccessUser(currentUser: any, targetUser: any): boolean {
    // Admin pode ver todos
    if (currentUser.role === 'admin') return true;
    
    // Pode ver próprio usuário
    if (currentUser.id === targetUser._id.toString()) return true;
    
    // Se tem acesso global, pode ver todos
    if (currentUser.tipoAcesso === 'global') return true;
    
    // Verificar se tem clientes em comum
    if (targetUser.tipoAcesso === 'global') return false;
    
    const clientesComum = targetUser.clientesVinculados.some((clienteId: any) =>
      currentUser.clientesVinculados.includes(clienteId.toString())
    );
    
    return clientesComum;
  }

  private canModifyUser(currentUser: any, targetUser: any): boolean {
    // Admin pode modificar todos (exceto outros admins)
    if (currentUser.role === 'admin') {
      return targetUser.role !== 'admin' || currentUser.id === targetUser._id.toString();
    }
    
    // Não pode modificar admins
    if (targetUser.role === 'admin') return false;
    
    // Deve ter permissão de editar usuários
    if (!this.hasPermission(currentUser, 'usuarios', 'editar')) return false;
    
    // Deve ter acesso ao usuário
    return this.canAccessUser(currentUser, targetUser);
  }

  private canCreateUserWithRole(currentUser: any, role: string): boolean {
    if (currentUser.role === 'admin') return true;
    
    // Não pode criar admins
    if (role === 'admin') return false;
    
    // Manager pode criar operator e viewer
    if (currentUser.role === 'manager') {
      return ['operator', 'viewer'].includes(role);
    }
    
    return false;
  }
}
