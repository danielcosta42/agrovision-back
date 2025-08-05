import { Cliente, ICliente } from '../models/Cliente';
import { CreateClienteDTO, UpdateClienteDTO } from '../dtos/ClienteDTO';

export class ClienteRepository {
  async findAll(): Promise<ICliente[]> {
    return await Cliente.find().sort({ dataCriacao: -1 });
  }

  async findById(id: string): Promise<ICliente | null> {
    return await Cliente.findById(id);
  }

  async findByEmail(email: string): Promise<ICliente | null> {
    return await Cliente.findOne({ email: email.toLowerCase() });
  }

  async create(clienteData: CreateClienteDTO): Promise<ICliente> {
    const cliente = new Cliente({
      ...clienteData,
      email: clienteData.email.toLowerCase()
    });
    return await cliente.save();
  }

  async update(id: string, clienteData: UpdateClienteDTO): Promise<ICliente | null> {
    const updateData = { ...clienteData };
    if (updateData.email) {
      updateData.email = updateData.email.toLowerCase();
    }
    
    return await Cliente.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
  }

  async delete(id: string): Promise<boolean> {
    const result = await Cliente.findByIdAndUpdate(
      id,
      { dataExclusao: new Date() },
      { new: true }
    );
    return !!result;
  }

  async search(searchTerm: string): Promise<ICliente[]> {
    const regex = new RegExp(searchTerm, 'i');
    return await Cliente.find({
      $or: [
        { nome: regex },
        { email: regex },
        { cnpj: regex },
        { cpf: regex }
      ]
    }).sort({ dataCriacao: -1 });
  }

  async count(): Promise<number> {
    return await Cliente.countDocuments();
  }

  async findWithPagination(page: number = 1, limit: number = 10): Promise<{ data: ICliente[], total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Cliente.find()
        .sort({ dataCriacao: -1 })
        .skip(skip)
        .limit(limit),
      Cliente.countDocuments()
    ]);

    return { data, total };
  }
}
