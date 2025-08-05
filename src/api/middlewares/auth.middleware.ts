import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../../modules/users/services/UserService';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    clientesVinculados?: string[];
    tipoAcesso?: string;
  };
}

class AuthMiddleware {
  private userService = new UserService();

  public authenticate() {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        // Verificar se o token foi fornecido
        const token = this.extractToken(req);
        
        if (!token) {
          return res.status(401).json({ 
            error: 'Token de acesso requerido',
            message: 'Forneça um token de autenticação válido'
          });
        }

        // Verificar e decodificar o token
        const decoded = this.verifyToken(token);
        
        if (!decoded) {
          return res.status(401).json({ 
            error: 'Token inválido',
            message: 'O token fornecido é inválido ou expirou'
          });
        }

        // Buscar dados atualizados do usuário
        const user = await this.userService.findById(decoded.id);
        
        if (!user) {
          return res.status(401).json({ 
            error: 'Usuário não encontrado',
            message: 'O usuário associado ao token não existe'
          });
        }

        // Verificar se o usuário está ativo
        if (user.status !== 'ativo') {
          return res.status(401).json({ 
            error: 'Usuário inativo',
            message: 'Sua conta está inativa ou suspensa'
          });
        }

        // Verificar se o usuário não está bloqueado
        if (user.bloqueadoAte && user.bloqueadoAte > new Date()) {
          return res.status(401).json({ 
            error: 'Usuário bloqueado',
            message: `Conta bloqueada até ${user.bloqueadoAte.toISOString()}`,
            bloqueadoAte: user.bloqueadoAte
          });
        }

        // Anexar dados do usuário à requisição
        req.user = {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          clientesVinculados: user.clientesVinculados?.map(id => id.toString()),
          tipoAcesso: user.tipoAcesso
        };

        next();
      } catch (error) {
        console.error('Erro na autenticação:', error);
        return res.status(500).json({ 
          error: 'Erro interno do servidor',
          message: 'Erro ao processar autenticação'
        });
      }
    };
  }

  private extractToken(req: Request): string | null {
    // Tentar obter o token do header Authorization
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Tentar obter o token dos cookies
    const cookieToken = req.cookies?.token;
    
    if (cookieToken) {
      return cookieToken;
    }

    return null;
  }

  private verifyToken(token: string): JwtPayload | null {
    try {
      const jwtSecret = process.env.JWT_SECRET || 'secret';
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
      return decoded;
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return null;
    }
  }

  public generateToken(user: { id: string; email: string; role: string }): string {
    const jwtSecret = process.env.JWT_SECRET || 'secret';
    const jwtExpiration = process.env.JWT_EXPIRATION || '24h';

    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      jwtSecret,
      {
        expiresIn: jwtExpiration
      } as jwt.SignOptions
    );
  }
}

// Instância singleton
const authMiddlewareInstance = new AuthMiddleware();

// Exportar o middleware de autenticação
export const authMiddleware = authMiddlewareInstance.authenticate();

// Exportar a classe para acesso aos métodos utilitários
export { AuthMiddleware };

// Manter compatibilidade com o código antigo
export default authMiddleware;
