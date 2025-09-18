import { Request, Response } from 'express';
import { PropriedadeService } from '../services/PropriedadeService';
import { CreatePropriedadeDTO, UpdatePropriedadeDTO } from '../dtos/PropriedadeDTO';

export class PropriedadeController {
  private propriedadeService: PropriedadeService;

  constructor() {
    this.propriedadeService = new PropriedadeService();
  }

  async index(req: Request, res: Response): Promise<Response> {
    const propriedades = await this.propriedadeService.getAllPropriedades();
    return res.json(propriedades);
  }

  async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const propriedade = await this.propriedadeService.getPropriedadeById(id);
    if (!propriedade) return res.status(404).json({ error: 'Propriedade não encontrada' });
    return res.json(propriedade);
  }

  async store(req: Request, res: Response): Promise<Response> {
    const data: CreatePropriedadeDTO = req.body;
    const propriedade = await this.propriedadeService.createPropriedade(data);
    return res.status(201).json(propriedade);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data: UpdatePropriedadeDTO = req.body;
    const propriedade = await this.propriedadeService.updatePropriedade(id, data);
    if (!propriedade) return res.status(404).json({ error: 'Propriedade não encontrada' });
    return res.json(propriedade);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const deleted = await this.propriedadeService.deletePropriedade(id);
    if (!deleted) return res.status(404).json({ error: 'Propriedade não encontrada' });
    return res.status(204).send();
  }
}
