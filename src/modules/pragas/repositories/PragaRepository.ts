import { Praga, IPraga } from '../models/Praga';
import { CreatePragaDTO, UpdatePragaDTO } from '../dtos/PragaDTO';
import mongoose from 'mongoose';

export class PragaRepository {
  async findAll(): Promise<IPraga[]> {
    return await Praga.find().populate('culturaId', 'nome variedade areaId').sort({ dataCriacao: -1 });
  }

  async findByCulturaId(culturaId: string): Promise<IPraga[]> {
    return await Praga.find({ culturaId: new mongoose.Types.ObjectId(culturaId) })
      .populate('culturaId', 'nome variedade areaId')
      .sort({ dataCriacao: -1 });
  }

  async findById(id: string): Promise<IPraga | null> {
    return await Praga.findById(id).populate('culturaId', 'nome variedade areaId');
  }

  async findAtivas(): Promise<IPraga[]> {
    return await Praga.find({ dataResolucao: { $exists: false } })
      .populate('culturaId', 'nome variedade areaId')
      .sort({ dataCriacao: -1 });
  }

  async create(pragaData: CreatePragaDTO): Promise<IPraga> {
    const praga = new Praga({
      ...pragaData,
      culturaId: new mongoose.Types.ObjectId(pragaData.culturaId)
    });
    return await praga.save();
  }

  async update(id: string, pragaData: UpdatePragaDTO): Promise<IPraga | null> {
    return await Praga.findByIdAndUpdate(
      id,
      pragaData,
      { new: true, runValidators: true }
    ).populate('culturaId', 'nome variedade areaId');
  }

  async delete(id: string): Promise<boolean> {
    const result = await Praga.findByIdAndUpdate(
      id,
      { dataExclusao: new Date() },
      { new: true }
    );
    return !!result;
  }

  async search(searchTerm: string): Promise<IPraga[]> {
    const regex = new RegExp(searchTerm, 'i');
    return await Praga.find({
      $or: [
        { nome: regex },
        { tipo: regex },
        { gravidade: regex },
        { tratamentoAplicado: regex }
      ]
    }).populate('culturaId', 'nome variedade areaId').sort({ dataCriacao: -1 });
  }

  async findWithPagination(page: number = 1, limit: number = 10, culturaId?: string): Promise<{ data: IPraga[], total: number }> {
    const skip = (page - 1) * limit;
    const filter = culturaId ? { culturaId: new mongoose.Types.ObjectId(culturaId) } : {};
    
    const [data, total] = await Promise.all([
      Praga.find(filter)
        .populate('culturaId', 'nome variedade areaId')
        .sort({ dataCriacao: -1 })
        .skip(skip)
        .limit(limit),
      Praga.countDocuments(filter)
    ]);

    return { data, total };
  }
}
