import cron from 'node-cron';
import { CulturaService } from '../modules/culturas/services/CulturaService';
import { PerdaService } from '../modules/perdas/services/PerdaService';
import { PragaService } from '../modules/pragas/services/PragaService';

interface RelatorioData {
  totalCulturas: number;
  culturasAtivas: number;
  totalPerdas: number;
  valorTotalPerdas: number;
  pragasAtivas: number;
  dataGeracao: Date;
}

export class GerarRelatoriosJob {
  private culturaService: CulturaService;
  private perdaService: PerdaService;
  private pragaService: PragaService;

  constructor() {
    this.culturaService = new CulturaService();
    this.perdaService = new PerdaService();
    this.pragaService = new PragaService();
  }

  public iniciarJobs(): void {
    // Executa todos os dias às 6:00
    cron.schedule('0 6 * * *', async () => {
      console.log('🔄 Iniciando geração de relatórios diários...');
      await this.gerarRelatorioDiario();
    });

    // Executa toda segunda-feira às 8:00
    cron.schedule('0 8 * * 1', async () => {
      console.log('🔄 Iniciando geração de relatórios semanais...');
      await this.gerarRelatorioSemanal();
    });

    // Executa no primeiro dia do mês às 9:00
    cron.schedule('0 9 1 * *', async () => {
      console.log('🔄 Iniciando geração de relatórios mensais...');
      await this.gerarRelatorioMensal();
    });

    console.log('⏰ Jobs de relatórios configurados');
  }

  private async gerarRelatorioDiario(): Promise<void> {
    try {
      const dados = await this.coletarDados();
      
      console.log('📊 Relatório Diário:', {
        data: dados.dataGeracao.toISOString().split('T')[0],
        culturas: dados.totalCulturas,
        perdas: dados.totalPerdas,
        pragas: dados.pragasAtivas,
      });

      // Aqui você pode implementar o envio por email, salvamento em arquivo, etc.
      await this.salvarRelatorio('diario', dados);
      
    } catch (error) {
      console.error('❌ Erro ao gerar relatório diário:', error);
    }
  }

  private async gerarRelatorioSemanal(): Promise<void> {
    try {
      const dados = await this.coletarDados();
      
      console.log('📊 Relatório Semanal:', {
        semana: `${dados.dataGeracao.toISOString().split('T')[0]}`,
        culturas: dados.totalCulturas,
        perdas: `R$ ${dados.valorTotalPerdas.toFixed(2)}`,
        pragas: dados.pragasAtivas,
      });

      await this.salvarRelatorio('semanal', dados);
      
    } catch (error) {
      console.error('❌ Erro ao gerar relatório semanal:', error);
    }
  }

  private async gerarRelatorioMensal(): Promise<void> {
    try {
      const dados = await this.coletarDados();
      
      console.log('📊 Relatório Mensal:', {
        mes: dados.dataGeracao.getMonth() + 1,
        ano: dados.dataGeracao.getFullYear(),
        resumo: {
          culturas: dados.totalCulturas,
          culturasAtivas: dados.culturasAtivas,
          perdas: dados.totalPerdas,
          valorPerdas: `R$ ${dados.valorTotalPerdas.toFixed(2)}`,
          pragas: dados.pragasAtivas,
        },
      });

      await this.salvarRelatorio('mensal', dados);
      
    } catch (error) {
      console.error('❌ Erro ao gerar relatório mensal:', error);
    }
  }

  private async coletarDados(): Promise<RelatorioData> {
    const culturas = await this.culturaService.getAllCulturas();
    const perdas = await this.perdaService.getAllPerdas();
    const pragas = await this.pragaService.getAllPragas();

    const culturasAtivas = culturas.filter(
      cultura => cultura.estadoAtual !== 'colhida'
    ).length;

    const valorTotalPerdas = perdas.reduce(
      (total, perda) => total + perda.valorEstimado, 0
    );

    const pragasAtivas = pragas.filter(
      praga => !praga.dataResolucao
    ).length;

    return {
      totalCulturas: culturas.length,
      culturasAtivas,
      totalPerdas: perdas.length,
      valorTotalPerdas,
      pragasAtivas,
      dataGeracao: new Date(),
    };
  }

  private async salvarRelatorio(tipo: string, dados: RelatorioData): Promise<void> {
    // Implementar salvamento em banco de dados ou arquivo
    console.log(`💾 Salvando relatório ${tipo}:`, dados);
    
    // Exemplo de implementação futura:
    // await this.relatorioRepository.create({
    //   tipo,
    //   dados,
    //   dataGeracao: dados.dataGeracao
    // });
  }
}
