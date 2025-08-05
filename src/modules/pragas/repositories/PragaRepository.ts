import { Praga } from '../models/Praga';
import { CreatePragaDTO, UpdatePragaDTO } from '../dtos/PragaDTO';

export class PragaRepository {
  private pragas: Praga[] = [];
  private nextId = 1;

  async findAll(): Promise<Praga[]> {
    return this.pragas;
  }

  async findByCulturaId(culturaId: string): Promise<Praga[]> {
    return this.pragas.filter(praga => praga.culturaId === culturaId);
  }

  async findById(id: string): Promise<Praga | null> {
    return this.pragas.find(praga => praga.id === id) || null;
  }

  async findAtivas(): Promise<Praga[]> {
    return this.pragas.filter(praga => !praga.dataResolucao);
  }

  async create(pragaData: CreatePragaDTO): Promise<Praga> {
    const praga: Praga = {
      id: this.nextId.toString(),
      ...pragaData,
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
    };

    this.pragas.push(praga);
    this.nextId++;

    return praga;
  }

  async update(id: string, pragaData: UpdatePragaDTO): Promise<Praga | null> {
    const index = this.pragas.findIndex(praga => praga.id === id);
    
    if (index === -1) {
      return null;
    }

    this.pragas[index] = {
      ...this.pragas[index],
      ...pragaData,
      dataAtualizacao: new Date(),
    };

    return this.pragas[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.pragas.findIndex(praga => praga.id === id);
    
    if (index === -1) {
      return false;
    }

    this.pragas.splice(index, 1);
    return true;
  }
}
