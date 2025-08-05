import { Request, Response } from 'express';
import { AreaService } from '../services/AreaService';
import { CreateAreaDTO, UpdateAreaDTO } from '../dtos/AreaDTO';

export class AreaController {
  private areaService: AreaService;

  constructor() {
    this.areaService = new AreaService();
  }

  async index(req: Request, res: Response): Promise<Response> {
    try {
      const { clienteId } = req.query;
      
      if (clienteId) {
        const areas = await this.areaService.getAreasByCliente(clienteId as string);
        return res.json(areas);
      }

      const areas = await this.areaService.getAllAreas();
      return res.json(areas);
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
      if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
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
