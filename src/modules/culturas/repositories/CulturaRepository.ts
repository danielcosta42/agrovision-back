import { Cultura } from '../models/Cultura';
import { CreateCulturaDTO, UpdateCulturaDTO } from '../dtos/CulturaDTO';

export class CulturaRepository {
  private culturas: Cultura[] = [];
  private nextId = 1;

  async findAll(): Promise<Cultura[]> {
    return this.culturas;
  }

  async findByAreaId(areaId: string): Promise<Cultura[]> {
    return this.culturas.filter(cultura => cultura.areaId === areaId);
  }

  async findById(id: string): Promise<Cultura | null> {
    return this.culturas.find(cultura => cultura.id === id) || null;
  }

  async create(culturaData: CreateCulturaDTO): Promise<Cultura> {
    const cultura: Cultura = {
      id: this.nextId.toString(),
      ...culturaData,
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
    };

    this.culturas.push(cultura);
    this.nextId++;

    return cultura;
  }

  async update(id: string, culturaData: UpdateCulturaDTO): Promise<Cultura | null> {
    const index = this.culturas.findIndex(cultura => cultura.id === id);
    
    if (index === -1) {
      return null;
    }

    this.culturas[index] = {
      ...this.culturas[index],
      ...culturaData,
      dataAtualizacao: new Date(),
    };

    return this.culturas[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.culturas.findIndex(cultura => cultura.id === id);
    
    if (index === -1) {
      return false;
    }

    this.culturas.splice(index, 1);
    return true;
  }
}
