import { Propriedade, IPropriedade } from '../models/Propriedade';
import { CreatePropriedadeDTO, UpdatePropriedadeDTO } from '../dtos/PropriedadeDTO';

export class PropriedadeRepository {
  async findAll(): Promise<IPropriedade[]> {
    return await Propriedade.find();
  }

  async findById(id: string): Promise<IPropriedade | null> {
    return await Propriedade.findById(id);
  }

  async create(data: CreatePropriedadeDTO): Promise<IPropriedade> {
    return await Propriedade.create(data);
  }

  async update(id: string, data: UpdatePropriedadeDTO): Promise<IPropriedade | null> {
    return await Propriedade.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Propriedade.findByIdAndDelete(id);
    return !!result;
  }
}
