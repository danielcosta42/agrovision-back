import { Request, Response } from 'express';
import { CulturaService } from '../services/CulturaService';
import { CreateCulturaDTO, UpdateCulturaDTO } from '../dtos/CulturaDTO';

export class CulturaController {
  private culturaService: CulturaService;

  constructor() {
    this.culturaService = new CulturaService();
  }

  async index(req: Request, res: Response): Promise<Response> {
    try {
      const { areaId } = req.query;
      
      if (areaId) {
        const culturas = await this.culturaService.getCulturasByArea(areaId as string);
        return res.json(culturas);
      }

      const culturas = await this.culturaService.getAllCulturas();
      return res.json(culturas);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async show(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const cultura = await this.culturaService.getCulturaById(id);
      return res.json(cultura);
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async store(req: Request, res: Response): Promise<Response> {
    try {
      const culturaData: CreateCulturaDTO = req.body;
      const cultura = await this.culturaService.createCultura(culturaData);
      return res.status(201).json(cultura);
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
      const culturaData: UpdateCulturaDTO = req.body;
      const cultura = await this.culturaService.updateCultura(id, culturaData);
      return res.json(cultura);
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
      await this.culturaService.deleteCultura(id);
      return res.status(204).send();
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
