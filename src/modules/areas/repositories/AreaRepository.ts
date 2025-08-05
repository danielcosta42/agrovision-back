import { Area, IArea } from '../models/Area';
import { CreateAreaDTO, UpdateAreaDTO } from '../dtos/AreaDTO';
import mongoose from 'mongoose';

export class AreaRepository {
  async findAll(): Promise<IArea[]> {
    return await Area.find().populate('clienteId', 'nome email').sort({ dataCriacao: -1 });
  }

  async findByClienteId(clienteId: string): Promise<IArea[]> {
    return await Area.find({ clienteId: new mongoose.Types.ObjectId(clienteId) })
      .populate('clienteId', 'nome email')
      .sort({ dataCriacao: -1 });
  }

  async findById(id: string): Promise<IArea | null> {
    return await Area.findById(id).populate('clienteId', 'nome email');
  }

  async create(areaData: CreateAreaDTO): Promise<IArea> {
    const area = new Area({
      ...areaData,
      clienteId: new mongoose.Types.ObjectId(areaData.clienteId)
    });
    return await area.save();
  }

  async update(id: string, areaData: UpdateAreaDTO): Promise<IArea | null> {
    return await Area.findByIdAndUpdate(
      id,
      areaData,
      { new: true, runValidators: true }
    ).populate('clienteId', 'nome email');
  }

  async delete(id: string): Promise<boolean> {
    const result = await Area.findByIdAndUpdate(
      id,
      { dataExclusao: new Date() },
      { new: true }
    );
    return !!result;
  }

  async search(searchTerm: string): Promise<IArea[]> {
    const regex = new RegExp(searchTerm, 'i');
    return await Area.find({
      $or: [
        { nome: regex },
        { solo: regex },
        { tipo: regex }
      ]
    }).populate('clienteId', 'nome email').sort({ dataCriacao: -1 });
  }

  async findWithPagination(page: number = 1, limit: number = 10, clienteId?: string): Promise<{ data: IArea[], total: number }> {
    const skip = (page - 1) * limit;
    const filter = clienteId ? { clienteId: new mongoose.Types.ObjectId(clienteId) } : {};
    
    const [data, total] = await Promise.all([
      Area.find(filter)
        .populate('clienteId', 'nome email')
        .sort({ dataCriacao: -1 })
        .skip(skip)
        .limit(limit),
      Area.countDocuments(filter)
    ]);

    return { data, total };
  }
}
