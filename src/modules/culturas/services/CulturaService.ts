import { CulturaRepository } from '../repositories/CulturaRepository';
import { CreateCulturaDTO, UpdateCulturaDTO, CulturaResponseDTO } from '../dtos/CulturaDTO';
import { AppError } from '../../../shared/errors/AppError';

export class CulturaService {
  private culturaRepository: CulturaRepository;

  constructor() {
    this.culturaRepository = new CulturaRepository();
  }

  async getAllCulturas(): Promise<CulturaResponseDTO[]> {
    const culturas = await this.culturaRepository.findAll();
    return culturas.map(cultura => this.mapToResponseDTO(cultura));
  }

  async getCulturasByArea(areaId: string): Promise<CulturaResponseDTO[]> {
    const culturas = await this.culturaRepository.findByAreaId(areaId);
    return culturas.map(cultura => this.mapToResponseDTO(cultura));
  }

  async getCulturaById(id: string): Promise<CulturaResponseDTO> {
    const cultura = await this.culturaRepository.findById(id);
    
    if (!cultura) {
      throw new AppError('Cultura não encontrada', 404);
    }

    return this.mapToResponseDTO(cultura);
  }

  async createCultura(culturaData: CreateCulturaDTO): Promise<CulturaResponseDTO> {
    const cultura = await this.culturaRepository.create(culturaData);
    return this.mapToResponseDTO(cultura);
  }

  async updateCultura(id: string, culturaData: UpdateCulturaDTO): Promise<CulturaResponseDTO> {
    const cultura = await this.culturaRepository.update(id, culturaData);
    
    if (!cultura) {
      throw new AppError('Cultura não encontrada', 404);
    }

    return this.mapToResponseDTO(cultura);
  }

  async deleteCultura(id: string): Promise<void> {
    const deleted = await this.culturaRepository.delete(id);
    
    if (!deleted) {
      throw new AppError('Cultura não encontrada', 404);
    }
  }

  private mapToResponseDTO(cultura: any): CulturaResponseDTO {
    return {
      id: cultura._id?.toString() || cultura.id,
      nome: cultura.nome,
      variedade: cultura.variedade,
      areaId: cultura.areaId?.toString() || cultura.areaId,
      dataPlantio: cultura.dataPlantio,
      dataColheita: cultura.dataColheita,
      estadoAtual: cultura.estadoAtual,
      produtividade: cultura.produtividade,
      observacoes: cultura.observacoes,
      dataCriacao: cultura.dataCriacao!,
      dataAtualizacao: cultura.dataAtualizacao!,
    };
  }
}
