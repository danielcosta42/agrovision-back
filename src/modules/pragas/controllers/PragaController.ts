import { Request, Response } from 'express';
import { PragaService } from '../services/PragaService';
import { CreatePragaDTO, UpdatePragaDTO } from '../dtos/PragaDTO';

export class PragaController {
  private pragaService: PragaService;

  constructor() {
    this.pragaService = new PragaService();
  }

  async index(req: Request, res: Response): Promise<Response> {
    try {
      const { culturaId, ativas } = req.query;
      
      if (culturaId) {
        const pragas = await this.pragaService.getPragasByCultura(culturaId as string);
        return res.json(pragas);
      }

      if (ativas === 'true') {
        const pragas = await this.pragaService.getPragasAtivas();
        return res.json(pragas);
      }

      const pragas = await this.pragaService.getAllPragas();
      return res.json(pragas);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async show(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const praga = await this.pragaService.getPragaById(id);
      return res.json(praga);
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async store(req: Request, res: Response): Promise<Response> {
    try {
      const pragaData: CreatePragaDTO = req.body;
      const praga = await this.pragaService.createPraga(pragaData);
      return res.status(201).json(praga);
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
      const pragaData: UpdatePragaDTO = req.body;
      const praga = await this.pragaService.updatePraga(id, pragaData);
      return res.json(praga);
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
      await this.pragaService.deletePraga(id);
      return res.status(204).send();
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
