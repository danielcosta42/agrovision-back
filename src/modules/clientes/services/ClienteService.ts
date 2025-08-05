import { ClienteRepository } from '../repositories/ClienteRepository';
import { CreateClienteDTO, UpdateClienteDTO, ClienteResponseDTO } from '../dtos/ClienteDTO';
import { AppError } from '../../../shared/errors/AppError';

export class ClienteService {
  private clienteRepository: ClienteRepository;

  constructor() {
    this.clienteRepository = new ClienteRepository();
  }

  async getAllClientes(): Promise<ClienteResponseDTO[]> {
    const clientes = await this.clienteRepository.findAll();
    return clientes.map(cliente => this.mapToResponseDTO(cliente));
  }

  async getClienteById(id: string): Promise<ClienteResponseDTO> {
    const cliente = await this.clienteRepository.findById(id);
    
    if (!cliente) {
      throw new AppError('Cliente não encontrado', 404);
    }

    return this.mapToResponseDTO(cliente);
  }

  async createCliente(clienteData: CreateClienteDTO): Promise<ClienteResponseDTO> {
    // Verificar se email já existe
    const existingCliente = await this.clienteRepository.findByEmail(clienteData.email);
    
    if (existingCliente) {
      throw new AppError('Email já está em uso', 400);
    }

    const cliente = await this.clienteRepository.create(clienteData);
    return this.mapToResponseDTO(cliente);
  }

  async updateCliente(id: string, clienteData: UpdateClienteDTO): Promise<ClienteResponseDTO> {
    // Verificar se email já existe para outro cliente
    if (clienteData.email) {
      const existingCliente = await this.clienteRepository.findByEmail(clienteData.email);
      
      if (existingCliente && existingCliente.id !== id) {
        throw new AppError('Email já está em uso', 400);
      }
    }

    const cliente = await this.clienteRepository.update(id, clienteData);
    
    if (!cliente) {
      throw new AppError('Cliente não encontrado', 404);
    }

    return this.mapToResponseDTO(cliente);
  }

  async deleteCliente(id: string): Promise<void> {
    const deleted = await this.clienteRepository.delete(id);
    
    if (!deleted) {
      throw new AppError('Cliente não encontrado', 404);
    }
  }

  private mapToResponseDTO(cliente: any): ClienteResponseDTO {
    return {
      id: cliente.id!,
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      endereco: cliente.endereco,
      cnpj: cliente.cnpj,
      cpf: cliente.cpf,
      dataCriacao: cliente.dataCriacao!,
      dataAtualizacao: cliente.dataAtualizacao!,
    };
  }
}
