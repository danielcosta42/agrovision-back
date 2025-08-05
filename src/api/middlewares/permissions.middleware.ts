import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../modules/users/services/UserService';
import { Role } from '../../modules/users/models/User';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    clientesVinculados?: string[];
    tipoAcesso?: string;
  };
}

export class PermissionsMiddleware {
  private userService = new UserService();

  // Verificar se o usuário tem pelo menos uma das roles especificadas
  public requireRoles(roles: string[]) {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        if (!req.user) {
          return res.status(401).json({ error: 'Usuário não autenticado' });
        }

        // Buscar dados completos do usuário
        const user = await this.userService.findById(req.user.id);
        
        if (!user) {
          return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        // Verificar se o usuário tem uma das roles necessárias
        if (!roles.includes(user.role)) {
          return res.status(403).json({ 
            error: 'Acesso negado',
            requiredRoles: roles,
            userRole: user.role
          });
        }

        // Atualizar dados do usuário na requisição
        req.user = {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          clientesVinculados: user.clientesVinculados?.map(id => id.toString()),
          tipoAcesso: user.tipoAcesso
        };

        next();
      } catch (error) {
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
    };
  }

  // Verificar se o usuário pode acessar dados de um cliente específico
  public requireClientAccess() {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        if (!req.user) {
          return res.status(401).json({ error: 'Usuário não autenticado' });
        }

        const targetClientId = req.params.clientId || req.body.clientId || req.query.clientId;
        
        // Admin com acesso global pode acessar qualquer cliente
        if (req.user.role === Role.ADMIN && req.user.tipoAcesso === 'global') {
          return next();
        }

        // Verificar se o usuário tem acesso ao cliente específico
        if (!req.user.clientesVinculados || req.user.clientesVinculados.length === 0) {
          return res.status(403).json({ error: 'Usuário não vinculado a nenhum cliente' });
        }

        if (targetClientId && !req.user.clientesVinculados.includes(targetClientId)) {
          return res.status(403).json({ 
            error: 'Acesso negado ao cliente especificado',
            allowedClients: req.user.clientesVinculados,
            requestedClient: targetClientId
          });
        }

        next();
      } catch (error) {
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
    };
  }

  // Verificar se o usuário pode gerenciar outros usuários
  public requireUserManagement() {
    return this.requireRoles([Role.ADMIN, Role.MANAGER]);
  }

  // Verificar se o usuário pode acessar apenas seus próprios dados
  public requireSelfOrAdmin() {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        if (!req.user) {
          return res.status(401).json({ error: 'Usuário não autenticado' });
        }

        const targetUserId = req.params.id || req.params.userId;
        
        // Admin global pode acessar qualquer usuário
        if (req.user.role === Role.ADMIN && req.user.tipoAcesso === 'global') {
          return next();
        }

        // Manager pode acessar usuários dos mesmos clientes vinculados
        if (req.user.role === Role.MANAGER && req.user.clientesVinculados && req.user.clientesVinculados.length > 0) {
          const targetUser = await this.userService.findById(targetUserId);
          
          if (targetUser && targetUser.clientesVinculados) {
            const hasCommonClient = targetUser.clientesVinculados.some(clientId => 
              req.user?.clientesVinculados?.includes(clientId.toString()) || false
            );
            
            if (hasCommonClient) {
              return next();
            }
          }
        }

        // Usuário só pode acessar seus próprios dados
        if (targetUserId === req.user.id) {
          return next();
        }

        return res.status(403).json({ 
          error: 'Acesso negado',
          message: 'Você só pode acessar seus próprios dados ou usuários dos mesmos clientes'
        });
      } catch (error) {
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
    };
  }

  // Verificar permissões específicas por recurso
  public requirePermission(recurso: string, acao: string) {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        if (!req.user) {
          return res.status(401).json({ error: 'Usuário não autenticado' });
        }

        const user = await this.userService.findById(req.user.id);
        
        if (!user) {
          return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        // Verificar se o usuário tem a permissão específica
        if (!user.temPermissao(recurso, acao)) {
          return res.status(403).json({ 
            error: 'Permissão insuficiente',
            recurso,
            acao,
            message: `Você não tem permissão para ${acao} ${recurso}`
          });
        }

        next();
      } catch (error) {
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
    };
  }
}

// Instância singleton para uso nas rotas
export const permissionsMiddleware = new PermissionsMiddleware();
