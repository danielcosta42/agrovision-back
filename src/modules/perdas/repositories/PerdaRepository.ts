import { Perda, IPerda } from '../models/Perda';
import { CreatePerdaDTO, UpdatePerdaDTO } from '../dtos/PerdaDTO';
import mongoose from 'mongoose';

export class PerdaRepository {
  async findAll(): Promise<IPerda[]> {
    return await Perda.find().populate('culturaId', 'nome variedade areaId').sort({ dataCriacao: -1 });
  }

  async findByCulturaId(culturaId: string): Promise<IPerda[]> {
    return await Perda.find({ culturaId: new mongoose.Types.ObjectId(culturaId) })
      .populate('culturaId', 'nome variedade areaId')
      .sort({ dataCriacao: -1 });
  }

  async findByTipo(tipo: string): Promise<IPerda[]> {
    return await Perda.find({ tipo })
      .populate('culturaId', 'nome variedade areaId')
      .sort({ dataCriacao: -1 });
  }

  async findById(id: string): Promise<IPerda | null> {
    return await Perda.findById(id).populate('culturaId', 'nome variedade areaId');
  }

  async getTotalValueByPeriod(startDate: Date, endDate: Date): Promise<number> {
    const result = await Perda.aggregate([
      {
        $match: {
          dataOcorrencia: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$valorEstimado' }
        }
      }
    ]);
    
    return result.length > 0 ? result[0].total : 0;
  }

  async create(perdaData: CreatePerdaDTO): Promise<IPerda> {
    const perda = new Perda({
      ...perdaData,
      culturaId: new mongoose.Types.ObjectId(perdaData.culturaId)
    });
    return await perda.save();
  }

  async update(id: string, perdaData: UpdatePerdaDTO): Promise<IPerda | null> {
    return await Perda.findByIdAndUpdate(
      id,
      perdaData,
      { new: true, runValidators: true }
    ).populate('culturaId', 'nome variedade areaId');
  }

  async delete(id: string): Promise<boolean> {
    const result = await Perda.findByIdAndUpdate(
      id,
      { dataExclusao: new Date() },
      { new: true }
    );
    return !!result;
  }

  async search(searchTerm: string): Promise<IPerda[]> {
    const regex = new RegExp(searchTerm, 'i');
    return await Perda.find({
      $or: [
        { tipo: regex },
        { descricao: regex },
        { medidaPreventiva: regex }
      ]
    }).populate('culturaId', 'nome variedade areaId').sort({ dataCriacao: -1 });
  }

  async findWithPagination(page: number = 1, limit: number = 10, culturaId?: string): Promise<{ data: IPerda[], total: number }> {
    const skip = (page - 1) * limit;
    const filter = culturaId ? { culturaId: new mongoose.Types.ObjectId(culturaId) } : {};
    
    const [data, total] = await Promise.all([
      Perda.find(filter)
        .populate('culturaId', 'nome variedade areaId')
        .sort({ dataCriacao: -1 })
        .skip(skip)
        .limit(limit),
      Perda.countDocuments(filter)
    ]);

    return { data, total };
  }

  async getStatisticsByType(): Promise<any[]> {
    return await Perda.aggregate([
      {
        $group: {
          _id: '$tipo',
          count: { $sum: 1 },
          totalValue: { $sum: '$valorEstimado' },
          avgValue: { $avg: '$valorEstimado' }
        }
      },
      {
        $sort: { totalValue: -1 }
      }
    ]);
  }
}
