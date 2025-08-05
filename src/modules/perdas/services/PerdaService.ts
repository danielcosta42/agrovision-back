import { PerdaRepository } from '../repositories/PerdaRepository';
import { CreatePerdaDTO, UpdatePerdaDTO, PerdaResponseDTO } from '../dtos/PerdaDTO';
import { AppError } from '../../../shared/errors/AppError';

export class PerdaService {
  private perdaRepository: PerdaRepository;

  constructor() {
    this.perdaRepository = new PerdaRepository();
  }

  async getAllPerdas(): Promise<PerdaResponseDTO[]> {
    const perdas = await this.perdaRepository.findAll();
    return perdas.map(perda => this.mapToResponseDTO(perda));
  }

  async getPerdasByCultura(culturaId: string): Promise<PerdaResponseDTO[]> {
    const perdas = await this.perdaRepository.findByCulturaId(culturaId);
    return perdas.map(perda => this.mapToResponseDTO(perda));
  }

  async getPerdasByTipo(tipo: string): Promise<PerdaResponseDTO[]> {
    const perdas = await this.perdaRepository.findByTipo(tipo);
    return perdas.map(perda => this.mapToResponseDTO(perda));
  }

  async getPerdaById(id: string): Promise<PerdaResponseDTO> {
    const perda = await this.perdaRepository.findById(id);
    
    if (!perda) {
      throw new AppError('Perda não encontrada', 404);
    }

    return this.mapToResponseDTO(perda);
  }

  async createPerda(perdaData: CreatePerdaDTO): Promise<PerdaResponseDTO> {
    const perda = await this.perdaRepository.create(perdaData);
    return this.mapToResponseDTO(perda);
  }

  async updatePerda(id: string, perdaData: UpdatePerdaDTO): Promise<PerdaResponseDTO> {
    const perda = await this.perdaRepository.update(id, perdaData);
    
    if (!perda) {
      throw new AppError('Perda não encontrada', 404);
    }

    return this.mapToResponseDTO(perda);
  }

  async deletePerda(id: string): Promise<void> {
    const deleted = await this.perdaRepository.delete(id);
    
    if (!deleted) {
      throw new AppError('Perda não encontrada', 404);
    }
  }

  async getRelatorioFinanceiro(startDate: Date, endDate: Date): Promise<{
    valorTotal: number;
    quantidade: number;
    porTipo: Record<string, { valor: number; quantidade: number }>
  }> {
    const valorTotal = await this.perdaRepository.getTotalValueByPeriod(startDate, endDate);
    const perdas = await this.perdaRepository.findAll();
    
    const perdasNoPeriodo = perdas.filter(perda => 
      perda.dataOcorrencia! >= startDate && perda.dataOcorrencia! <= endDate
    );

    const porTipo = perdasNoPeriodo.reduce((acc, perda) => {
      if (!acc[perda.tipo]) {
        acc[perda.tipo] = { valor: 0, quantidade: 0 };
      }
      acc[perda.tipo].valor += perda.valorEstimado;
      acc[perda.tipo].quantidade += 1;
      return acc;
    }, {} as Record<string, { valor: number; quantidade: number }>);

    return {
      valorTotal,
      quantidade: perdasNoPeriodo.length,
      porTipo,
    };
  }

  private mapToResponseDTO(perda: any): PerdaResponseDTO {
    return {
      id: perda.id!,
      culturaId: perda.culturaId,
      tipo: perda.tipo,
      descricao: perda.descricao,
      quantidadeAfetada: perda.quantidadeAfetada,
      valorEstimado: perda.valorEstimado,
      dataOcorrencia: perda.dataOcorrencia,
      medidaPreventiva: perda.medidaPreventiva,
      observacoes: perda.observacoes,
      dataCriacao: perda.dataCriacao!,
      dataAtualizacao: perda.dataAtualizacao!,
    };
  }
}
