import { Request, Response } from 'express';
import { PerdaService } from '../services/PerdaService';
import { CreatePerdaDTO, UpdatePerdaDTO } from '../dtos/PerdaDTO';

export class PerdaController {
  private perdaService: PerdaService;

  constructor() {
    this.perdaService = new PerdaService();
  }

  async index(req: Request, res: Response): Promise<Response> {
    try {
      const { culturaId, tipo } = req.query;
      
      if (culturaId) {
        const perdas = await this.perdaService.getPerdasByCultura(culturaId as string);
        return res.json(perdas);
      }

      if (tipo) {
        const perdas = await this.perdaService.getPerdasByTipo(tipo as string);
        return res.json(perdas);
      }

      const perdas = await this.perdaService.getAllPerdas();
      return res.json(perdas);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async show(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const perda = await this.perdaService.getPerdaById(id);
      return res.json(perda);
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async store(req: Request, res: Response): Promise<Response> {
    try {
      const perdaData: CreatePerdaDTO = req.body;
      const perda = await this.perdaService.createPerda(perdaData);
      return res.status(201).json(perda);
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const perdaData: UpdatePerdaDTO = req.body;
      const perda = await this.perdaService.updatePerda(id, perdaData);
      return res.json(perda);
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
      await this.perdaService.deletePerda(id);
      return res.status(204).send();
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async relatorioFinanceiro(req: Request, res: Response): Promise<Response> {
    try {
      const { dataInicio, dataFim } = req.query;
      
      if (!dataInicio || !dataFim) {
        return res.status(400).json({ 
          error: 'Parâmetros dataInicio e dataFim são obrigatórios' 
        });
      }

      const startDate = new Date(dataInicio as string);
      const endDate = new Date(dataFim as string);
      
      const relatorio = await this.perdaService.getRelatorioFinanceiro(startDate, endDate);
      return res.json(relatorio);
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
