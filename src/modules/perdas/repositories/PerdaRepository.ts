import { Perda } from '../models/Perda';
import { CreatePerdaDTO, UpdatePerdaDTO } from '../dtos/PerdaDTO';

export class PerdaRepository {
  private perdas: Perda[] = [];
  private nextId = 1;

  async findAll(): Promise<Perda[]> {
    return this.perdas;
  }

  async findByCulturaId(culturaId: string): Promise<Perda[]> {
    return this.perdas.filter(perda => perda.culturaId === culturaId);
  }

  async findByTipo(tipo: string): Promise<Perda[]> {
    return this.perdas.filter(perda => perda.tipo === tipo);
  }

  async findById(id: string): Promise<Perda | null> {
    return this.perdas.find(perda => perda.id === id) || null;
  }

  async getTotalValueByPeriod(startDate: Date, endDate: Date): Promise<number> {
    const perdasNoPeriodo = this.perdas.filter(perda => 
      perda.dataOcorrencia >= startDate && perda.dataOcorrencia <= endDate
    );
    
    return perdasNoPeriodo.reduce((total, perda) => total + perda.valorEstimado, 0);
  }

  async create(perdaData: CreatePerdaDTO): Promise<Perda> {
    const perda: Perda = {
      id: this.nextId.toString(),
      ...perdaData,
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
    };

    this.perdas.push(perda);
    this.nextId++;

    return perda;
  }

  async update(id: string, perdaData: UpdatePerdaDTO): Promise<Perda | null> {
    const index = this.perdas.findIndex(perda => perda.id === id);
    
    if (index === -1) {
      return null;
    }

    this.perdas[index] = {
      ...this.perdas[index],
      ...perdaData,
      dataAtualizacao: new Date(),
    };

    return this.perdas[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.perdas.findIndex(perda => perda.id === id);
    
    if (index === -1) {
      return false;
    }

    this.perdas.splice(index, 1);
    return true;
  }
}
