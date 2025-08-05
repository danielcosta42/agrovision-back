import { PragaRepository } from '../repositories/PragaRepository';
import { CreatePragaDTO, UpdatePragaDTO, PragaResponseDTO } from '../dtos/PragaDTO';
import { AppError } from '../../../shared/errors/AppError';

export class PragaService {
  private pragaRepository: PragaRepository;

  constructor() {
    this.pragaRepository = new PragaRepository();
  }

  async getAllPragas(): Promise<PragaResponseDTO[]> {
    const pragas = await this.pragaRepository.findAll();
    return pragas.map(praga => this.mapToResponseDTO(praga));
  }

  async getPragasByCultura(culturaId: string): Promise<PragaResponseDTO[]> {
    const pragas = await this.pragaRepository.findByCulturaId(culturaId);
    return pragas.map(praga => this.mapToResponseDTO(praga));
  }

  async getPragasAtivas(): Promise<PragaResponseDTO[]> {
    const pragas = await this.pragaRepository.findAtivas();
    return pragas.map(praga => this.mapToResponseDTO(praga));
  }

  async getPragaById(id: string): Promise<PragaResponseDTO> {
    const praga = await this.pragaRepository.findById(id);
    
    if (!praga) {
      throw new AppError('Praga não encontrada', 404);
    }

    return this.mapToResponseDTO(praga);
  }

  async createPraga(pragaData: CreatePragaDTO): Promise<PragaResponseDTO> {
    const praga = await this.pragaRepository.create(pragaData);
    return this.mapToResponseDTO(praga);
  }

  async updatePraga(id: string, pragaData: UpdatePragaDTO): Promise<PragaResponseDTO> {
    const praga = await this.pragaRepository.update(id, pragaData);
    
    if (!praga) {
      throw new AppError('Praga não encontrada', 404);
    }

    return this.mapToResponseDTO(praga);
  }

  async deletePraga(id: string): Promise<void> {
    const deleted = await this.pragaRepository.delete(id);
    
    if (!deleted) {
      throw new AppError('Praga não encontrada', 404);
    }
  }

  private mapToResponseDTO(praga: any): PragaResponseDTO {
    return {
      id: praga._id?.toString() || praga.id,
      nome: praga.nome,
      tipo: praga.tipo,
      gravidade: praga.gravidade,
      culturaId: praga.culturaId?.toString() || praga.culturaId,
      dataDeteccao: praga.dataDeteccao,
      areaAfetada: praga.areaAfetada,
      tratamentoAplicado: praga.tratamentoAplicado,
      dataResolucao: praga.dataResolucao,
      observacoes: praga.observacoes,
      dataCriacao: praga.dataCriacao!,
      dataAtualizacao: praga.dataAtualizacao!,
    };
  }
}
