import { Cliente } from '../models/Cliente';
import { CreateClienteDTO, UpdateClienteDTO } from '../dtos/ClienteDTO';

export class ClienteRepository {
  private clientes: Cliente[] = [];
  private nextId = 1;

  async findAll(): Promise<Cliente[]> {
    return this.clientes;
  }

  async findById(id: string): Promise<Cliente | null> {
    return this.clientes.find(cliente => cliente.id === id) || null;
  }

  async findByEmail(email: string): Promise<Cliente | null> {
    return this.clientes.find(cliente => cliente.email === email) || null;
  }

  async create(clienteData: CreateClienteDTO): Promise<Cliente> {
    const cliente: Cliente = {
      id: this.nextId.toString(),
      ...clienteData,
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
    };

    this.clientes.push(cliente);
    this.nextId++;

    return cliente;
  }

  async update(id: string, clienteData: UpdateClienteDTO): Promise<Cliente | null> {
    const index = this.clientes.findIndex(cliente => cliente.id === id);
    
    if (index === -1) {
      return null;
    }

    this.clientes[index] = {
      ...this.clientes[index],
      ...clienteData,
      dataAtualizacao: new Date(),
    };

    return this.clientes[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.clientes.findIndex(cliente => cliente.id === id);
    
    if (index === -1) {
      return false;
    }

    this.clientes.splice(index, 1);
    return true;
  }
}
