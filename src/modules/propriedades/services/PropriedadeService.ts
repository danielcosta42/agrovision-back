import { PropriedadeRepository } from '../repositories/PropriedadeRepository';
import { CreatePropriedadeDTO, UpdatePropriedadeDTO, PropriedadeResponseDTO } from '../dtos/PropriedadeDTO';

export class PropriedadeService {
  private propriedadeRepository: PropriedadeRepository;

  constructor() {
    this.propriedadeRepository = new PropriedadeRepository();
  }

  async getAllPropriedades(): Promise<PropriedadeResponseDTO[]> {
    const propriedades = await this.propriedadeRepository.findAll();
    return propriedades.map(this.mapToResponseDTO);
  }

  async getPropriedadeById(id: string): Promise<PropriedadeResponseDTO | null> {
    const propriedade = await this.propriedadeRepository.findById(id);
    return propriedade ? this.mapToResponseDTO(propriedade) : null;
  }

  async createPropriedade(data: CreatePropriedadeDTO): Promise<PropriedadeResponseDTO> {
    const propriedade = await this.propriedadeRepository.create(data);
    return this.mapToResponseDTO(propriedade);
  }

  async updatePropriedade(id: string, data: UpdatePropriedadeDTO): Promise<PropriedadeResponseDTO | null> {
    const propriedade = await this.propriedadeRepository.update(id, data);
    return propriedade ? this.mapToResponseDTO(propriedade) : null;
  }

  async deletePropriedade(id: string): Promise<boolean> {
    return await this.propriedadeRepository.delete(id);
  }

  private mapToResponseDTO(propriedade: any): PropriedadeResponseDTO {
    return {
      id: propriedade._id?.toString() || propriedade.id,
      clienteId: propriedade.clienteId,
      nome: propriedade.nome,
      pais: propriedade.pais,
      uf: propriedade.uf,
      municipio: propriedade.municipio,
      endereco: propriedade.endereco,
      cep: propriedade.cep,
      geom: propriedade.geom,
      srid: propriedade.srid,
      area_total_ha: propriedade.area_total_ha,
      centroide: propriedade.centroide,
      status: propriedade.status,
      data_inicio_operacao: propriedade.data_inicio_operacao,
      regime_posse: propriedade.regime_posse,
      proprietario_exibicao: propriedade.proprietario_exibicao,
      contrato_inicio: propriedade.contrato_inicio,
      contrato_fim: propriedade.contrato_fim,
      contrato_identificador: propriedade.contrato_identificador,
      car: propriedade.car,
      ccir: propriedade.ccir,
      gestor_nome: propriedade.gestor_nome,
      gestor_contato: propriedade.gestor_contato,
      created_at: propriedade.created_at,
      updated_at: propriedade.updated_at,
      created_by: propriedade.created_by,
      updated_by: propriedade.updated_by,
    };
  }
}
