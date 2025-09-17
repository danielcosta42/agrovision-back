import { Request, Response } from 'express';
import { ClienteService } from '../services/ClienteService';
import { CreateClienteDTO, UpdateClienteDTO } from '../dtos/ClienteDTO';

export class ClienteController {
  private clienteService: ClienteService;

  constructor() {
    this.clienteService = new ClienteService();
  }

  async index(req: Request, res: Response): Promise<Response> {
    try {
      const clientes = await this.clienteService.getAllClientes();
      return res.json(clientes);
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : 'Erro interno do servidors';
      return res.status(500).json({ error: errorMessage });
    }
  }

  async show(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const cliente = await this.clienteService.getClienteById(id);
      return res.json(cliente);
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message || 'Erro interno do servidors' });
    }
  }

  async store(req: Request, res: Response): Promise<Response> {
    try {
      const clienteData: CreateClienteDTO = req.body;
      const cliente = await this.clienteService.createCliente(clienteData);
      return res.status(201).json(cliente);
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
      const clienteData: UpdateClienteDTO = req.body;
      const cliente = await this.clienteService.updateCliente(id, clienteData);
      return res.json(cliente);
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidors' });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this.clienteService.deleteCliente(id);
      return res.status(204).send();
    } catch (error: any) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidors' });
    }
  }
}
