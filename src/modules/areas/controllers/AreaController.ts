import { Request, Response } from 'express';
import { AreaService } from '../services/AreaService';
import { CreateAreaDTO, UpdateAreaDTO } from '../dtos/AreaDTO';

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface User {
      tipoAcesso?: string;
      clientesVinculados?: any[];
      [key: string]: any;
    }
    interface Request {
      user?: User;
    }
  }
}

export class AreaController {
  private areaService: AreaService;

  constructor() {
    this.areaService = new AreaService();
  }

  async index(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user;
      // Se usuário global, retorna todas as áreas
      if (user && user.tipoAcesso === 'global') {
        const areas = await this.areaService.getAllAreas();
        return res.json(areas);
      }
      // Se usuário cliente-especifico, retorna apenas áreas dos clientes vinculados
      if (user && Array.isArray(user.clientesVinculados) && user.clientesVinculados.length > 0) {
        const areas = await this.areaService.getAreasByClientes(user.clientesVinculados);
        return res.json(areas);
      }
      // Sem permissão ou sem clientes vinculados
      return res.status(403).json({ error: 'Acesso restrito: nenhum cliente vinculado.' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async show(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const area = await this.areaService.getAreaById(id);
      return res.json(area);
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async store(req: Request, res: Response): Promise<Response> {
    try {
      const areaData: CreateAreaDTO = req.body;
      const area = await this.areaService.createArea(areaData);
      return res.status(201).json(area);
    } catch (error: any) {
      // Erro customizado da aplicação
      if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      // Erro de validação do MongoDB/Mongoose
      if (error.name === 'ValidationError' && error.errors) {
        const details = Object.values(error.errors).map((e: any) => e.message);
        return res.status(400).json({ error: 'Erro de validação', details });
      }

      // Erro de validação do MongoDB (schema)
      if (error.code === 121 && error.errInfo && error.errInfo.details) {
        return res.status(400).json({
          error: 'Erro de validação do banco de dados',
          details: error.errInfo.details.schemaRulesNotSatisfied || error.errInfo.details
        });
      }

      // Outros erros
      return res.status(500).json({ error: error.message || 'Erro interno do servidor' });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const areaData: UpdateAreaDTO = req.body;
      const area = await this.areaService.updateArea(id, areaData);
      return res.json(area);
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this.areaService.deleteArea(id);
      return res.status(204).send();
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
