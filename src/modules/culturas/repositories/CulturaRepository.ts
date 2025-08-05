import { Cultura, ICultura } from '../models/Cultura';
import { CreateCulturaDTO, UpdateCulturaDTO } from '../dtos/CulturaDTO';
import mongoose from 'mongoose';

export class CulturaRepository {
  async findAll(): Promise<ICultura[]> {
    return await Cultura.find().populate('areaId', 'nome tamanho clienteId').sort({ dataCriacao: -1 });
  }

  async findByAreaId(areaId: string): Promise<ICultura[]> {
    return await Cultura.find({ areaId: new mongoose.Types.ObjectId(areaId) })
      .populate('areaId', 'nome tamanho clienteId')
      .sort({ dataCriacao: -1 });
  }

  async findById(id: string): Promise<ICultura | null> {
    return await Cultura.findById(id).populate('areaId', 'nome tamanho clienteId');
  }

  async create(culturaData: CreateCulturaDTO): Promise<ICultura> {
    const cultura = new Cultura({
      ...culturaData,
      areaId: new mongoose.Types.ObjectId(culturaData.areaId)
    });
    return await cultura.save();
  }

  async update(id: string, culturaData: UpdateCulturaDTO): Promise<ICultura | null> {
    return await Cultura.findByIdAndUpdate(
      id,
      culturaData,
      { new: true, runValidators: true }
    ).populate('areaId', 'nome tamanho clienteId');
  }

  async delete(id: string): Promise<boolean> {
    const result = await Cultura.findByIdAndUpdate(
      id,
      { dataExclusao: new Date() },
      { new: true }
    );
    return !!result;
  }

  async search(searchTerm: string): Promise<ICultura[]> {
    const regex = new RegExp(searchTerm, 'i');
    return await Cultura.find({
      $or: [
        { nome: regex },
        { variedade: regex },
        { estadoAtual: regex }
      ]
    }).populate('areaId', 'nome tamanho clienteId').sort({ dataCriacao: -1 });
  }

  async findWithPagination(page: number = 1, limit: number = 10, areaId?: string): Promise<{ data: ICultura[], total: number }> {
    const skip = (page - 1) * limit;
    const filter = areaId ? { areaId: new mongoose.Types.ObjectId(areaId) } : {};
    
    const [data, total] = await Promise.all([
      Cultura.find(filter)
        .populate('areaId', 'nome tamanho clienteId')
        .sort({ dataCriacao: -1 })
        .skip(skip)
        .limit(limit),
      Cultura.countDocuments(filter)
    ]);

    return { data, total };
  }
}
