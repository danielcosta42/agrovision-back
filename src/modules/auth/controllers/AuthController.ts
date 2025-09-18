import { Request, Response } from 'express';
import { UserService } from '../../users/services/UserService';
import { AuthMiddleware } from '../../../api/middlewares/auth.middleware';
import bcrypt from 'bcryptjs';

interface LoginRequest {
  email: string;
  senha: string;
}

interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  role?: string;
  clientesVinculados?: string[];
  tipoAcesso?: string;
}

export class AuthController {
  private userService = new UserService();
  private authMiddleware = new AuthMiddleware();

  // Login do usuário
  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, senha }: LoginRequest = req.body;

      // Validar dados obrigatórios
      if (!email || !senha) {
        return res.status(400).json({
          error: 'Dados obrigatórios',
          message: 'Email e senha são obrigatórios'
        });
      }

      // Buscar usuário pelo email (incluindo senha)
      const user = await this.userService.findByEmail(email, true);

      if (!user) {
        return res.status(401).json({
          error: 'Credenciais inválidas',
          message: 'Email ou senha incorretos'
        });
      }

      // Verificar se o usuário está ativo
      if (user.status !== 'ativo') {
        return res.status(401).json({
          error: 'Conta inativa',
          message: 'Sua conta está inativa ou suspensa'
        });
      }

      // Verificar se o usuário não está bloqueado
      if (user.bloqueadoAte && user.bloqueadoAte > new Date()) {
        return res.status(401).json({
          error: 'Conta bloqueada',
          message: `Conta bloqueada até ${user.bloqueadoAte.toISOString()}`,
          bloqueadoAte: user.bloqueadoAte
        });
      }

      // Verificar senha
      const senhaValida = await user.compararSenha(senha);

      if (!senhaValida) {
        // Incrementar tentativas de login
        await this.userService.incrementarTentativasLogin(user._id.toString());
        
        return res.status(401).json({
          error: 'Credenciais inválidas',
          message: 'Email ou senha incorretos'
        });
      }

      // Reset das tentativas de login em caso de sucesso
      await this.userService.resetarTentativasLogin(user._id.toString());

      // Atualizar último login
      await this.userService.atualizarUltimoLogin(user._id.toString());

      // Gerar token
      const token = this.authMiddleware.generateToken({
        id: user._id.toString(),
        role: user.role,
        clientesVinculados: user.clientesVinculados?.map((id: any) => id.toString()) || []
      });

      // Remover dados sensíveis da resposta
      const userResponse = {
        id: user._id.toString(),
        nome: user.nome,
        email: user.email,
        telefone: user.telefone,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        tipoAcesso: user.tipoAcesso,
        clientesVinculados: user.clientesVinculados,
        permissoes: user.permissoes,
        ultimoLogin: user.ultimoLogin
      };

      return res.status(200).json({
        message: 'Login realizado com sucesso',
        user: userResponse,
        token,
        expiresIn: process.env.JWT_EXPIRATION || '24h'
      });

    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Erro ao processar login'
      });
    }
  }

  // Registro de novo usuário (apenas para admins)
  public async register(req: Request, res: Response): Promise<Response> {
    try {
      const userData: RegisterRequest = req.body;

      // Validar dados obrigatórios
      if (!userData.nome || !userData.email || !userData.senha) {
        return res.status(400).json({
          error: 'Dados obrigatórios',
          message: 'Nome, email e senha são obrigatórios'
        });
      }

      // Verificar se o email já existe
      const existingUser = await this.userService.findByEmail(userData.email);
      
      if (existingUser) {
        return res.status(409).json({
          error: 'Email já cadastrado',
          message: 'Este email já está sendo usado por outro usuário'
        });
      }

      // Criar novo usuário
      const newUser = await this.userService.create({
        nome: userData.nome,
        email: userData.email,
        senha: userData.senha,
        telefone: userData.telefone,
        role: (userData.role as 'admin' | 'manager' | 'operator' | 'viewer') || 'viewer',
        clientesVinculados: userData.clientesVinculados || [],
        tipoAcesso: (userData.tipoAcesso as 'global' | 'cliente-especifico') || 'cliente-especifico'
      });

      // Remover dados sensíveis da resposta
      const userResponse = {
        id: newUser._id.toString(),
        nome: newUser.nome,
        email: newUser.email,
        telefone: newUser.telefone,
        role: newUser.role,
        status: newUser.status,
        tipoAcesso: newUser.tipoAcesso,
        clientesVinculados: newUser.clientesVinculados,
        permissoes: newUser.permissoes,
        dataCriacao: newUser.dataCriacao
      };

      return res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: userResponse
      });

    } catch (error) {
      console.error('Erro no registro:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Erro ao criar usuário'
      });
    }
  }

  // Verificar token
  public async verifyToken(req: Request, res: Response): Promise<Response> {
    try {
      // Se chegou até aqui, o token é válido (passou pelo middleware)
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          error: 'Token inválido',
          message: 'Dados do usuário não encontrados no token'
        });
      }

      // Buscar dados atualizados do usuário
      const user = await this.userService.findById(userId);

      if (!user) {
        return res.status(401).json({
          error: 'Usuário não encontrado',
          message: 'O usuário associado ao token não existe'
        });
      }

      // Remover dados sensíveis da resposta
      const userResponse = {
        id: user._id.toString(),
        nome: user.nome,
        email: user.email,
        telefone: user.telefone,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        tipoAcesso: user.tipoAcesso,
        clientesVinculados: user.clientesVinculados,
        permissoes: user.permissoes,
        ultimoLogin: user.ultimoLogin
      };

      return res.status(200).json({
        valid: true,
        user: userResponse
      });

    } catch (error) {
      console.error('Erro na verificação do token:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Erro ao verificar token'
      });
    }
  }

  // Logout (invalidar token - implementação básica)
  public async logout(req: Request, res: Response): Promise<Response> {
    try {
      // Em uma implementação real, você pode:
      // 1. Adicionar o token a uma blacklist no Redis
      // 2. Usar refresh tokens e invalidá-los
      // 3. Reduzir o tempo de expiração do token

      return res.status(200).json({
        message: 'Logout realizado com sucesso',
        instruction: 'Remova o token do lado cliente'
      });

    } catch (error) {
      console.error('Erro no logout:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Erro ao processar logout'
      });
    }
  }

  // Alterar senha
  public async changePassword(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.id;
      const { senhaAtual, novaSenha } = req.body;

      if (!senhaAtual || !novaSenha) {
        return res.status(400).json({
          error: 'Dados obrigatórios',
          message: 'Senha atual e nova senha são obrigatórias'
        });
      }

      // Buscar usuário com senha
      const user = await this.userService.findByIdWithPassword(userId);

      if (!user) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      // Verificar senha atual
      const senhaValida = await user.compararSenha(senhaAtual);

      if (!senhaValida) {
        return res.status(401).json({
          error: 'Senha atual incorreta'
        });
      }

      // Atualizar senha
      await this.userService.updatePassword(userId, novaSenha);

      return res.status(200).json({
        message: 'Senha alterada com sucesso'
      });

    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Erro ao alterar senha'
      });
    }
  }
}
