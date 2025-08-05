import { AreaRepository } from '../repositories/AreaRepository';
import { CreateAreaDTO, UpdateAreaDTO, AreaResponseDTO } from '../dtos/AreaDTO';
import { AppError } from '../../../shared/errors/AppError';

export class AreaService {
  private areaRepository: AreaRepository;

  constructor() {
    this.areaRepository = new AreaRepository();
  }

  async getAllAreas(): Promise<AreaResponseDTO[]> {
    const areas = await this.areaRepository.findAll();
    return areas.map(area => this.mapToResponseDTO(area));
  }

  async getAreasByCliente(clienteId: string): Promise<AreaResponseDTO[]> {
    const areas = await this.areaRepository.findByClienteId(clienteId);
    return areas.map(area => this.mapToResponseDTO(area));
  }

  async getAreaById(id: string): Promise<AreaResponseDTO> {
    const area = await this.areaRepository.findById(id);
    
    if (!area) {
      throw new AppError('Área não encontrada', 404);
    }

    return this.mapToResponseDTO(area);
  }

  async createArea(areaData: CreateAreaDTO): Promise<AreaResponseDTO> {
    const area = await this.areaRepository.create(areaData);
    return this.mapToResponseDTO(area);
  }

  async updateArea(id: string, areaData: UpdateAreaDTO): Promise<AreaResponseDTO> {
    const area = await this.areaRepository.update(id, areaData);
    
    if (!area) {
      throw new AppError('Área não encontrada', 404);
    }

    return this.mapToResponseDTO(area);
  }

  async deleteArea(id: string): Promise<void> {
    const deleted = await this.areaRepository.delete(id);
    
    if (!deleted) {
      throw new AppError('Área não encontrada', 404);
    }
  }

  private mapToResponseDTO(area: any): AreaResponseDTO {
    return {
      id: area._id?.toString() || area.id,
      nome: area.nome,
      tamanho: area.tamanho,
      localizacao: area.localizacao,
      clienteId: area.clienteId?.toString() || area.clienteId,
      tipo: area.tipo,
      solo: area.solo,
      dataCriacao: area.dataCriacao!,
      dataAtualizacao: area.dataAtualizacao!,
    };
  }
}
