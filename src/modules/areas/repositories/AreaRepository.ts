import { Area } from '../models/Area';
import { CreateAreaDTO, UpdateAreaDTO } from '../dtos/AreaDTO';

export class AreaRepository {
  private areas: Area[] = [];
  private nextId = 1;

  async findAll(): Promise<Area[]> {
    return this.areas;
  }

  async findByClienteId(clienteId: string): Promise<Area[]> {
    return this.areas.filter(area => area.clienteId === clienteId);
  }

  async findById(id: string): Promise<Area | null> {
    return this.areas.find(area => area.id === id) || null;
  }

  async create(areaData: CreateAreaDTO): Promise<Area> {
    const area: Area = {
      id: this.nextId.toString(),
      ...areaData,
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
    };

    this.areas.push(area);
    this.nextId++;

    return area;
  }

  async update(id: string, areaData: UpdateAreaDTO): Promise<Area | null> {
    const index = this.areas.findIndex(area => area.id === id);
    
    if (index === -1) {
      return null;
    }

    this.areas[index] = {
      ...this.areas[index],
      ...areaData,
      dataAtualizacao: new Date(),
    };

    return this.areas[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.areas.findIndex(area => area.id === id);
    
    if (index === -1) {
      return false;
    }

    this.areas.splice(index, 1);
    return true;
  }
}
