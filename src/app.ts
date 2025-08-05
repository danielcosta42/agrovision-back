import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Routes
import clientesRoutes from './api/routes/clientes.routes';
import areasRoutes from './api/routes/areas.routes';
import culturasRoutes from './api/routes/culturas.routes';
import pragasRoutes from './api/routes/pragas.routes';
import perdasRoutes from './api/routes/perdas.routes';

// Middlewares
import { authMiddleware } from './api/middlewares/auth.middleware';

// Database
import { MongoConfig } from './shared/database/mongo.config';

// Jobs
import { GerarRelatoriosJob } from './jobs/gerarRelatorios';

// Error handling
import { AppError } from './shared/errors/AppError';

dotenv.config();

class App {
  public express: express.Application;
  private mongoConfig: MongoConfig;
  private relatoriosJob: GerarRelatoriosJob;

  constructor() {
    this.express = express();
    this.mongoConfig = MongoConfig.getInstance();
    this.relatoriosJob = new GerarRelatoriosJob();
    
    this.init();
  }

  private init(): void {
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
    this.connectDatabase();
    this.startJobs();
  }

  private setupMiddlewares(): void {
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(morgan('combined'));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes(): void {
    // Health check
    this.express.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // API routes
    this.express.use('/api/clientes', clientesRoutes);
    this.express.use('/api/areas', areasRoutes);
    this.express.use('/api/culturas', culturasRoutes);
    this.express.use('/api/pragas', pragasRoutes);
    this.express.use('/api/perdas', perdasRoutes);

    // Protected routes (example)
    // this.express.use('/api/admin', authMiddleware, adminRoutes);

    // 404 handler
    this.express.use('*', (req, res) => {
      res.status(404).json({ error: 'Rota não encontrada' });
    });
  }

  private setupErrorHandling(): void {
    this.express.use(
      (error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (error instanceof AppError) {
          return res.status(error.statusCode).json({
            error: error.message,
          });
        }

        console.error(error);

        return res.status(500).json({
          error: 'Erro interno do servidor',
        });
      }
    );
  }

  private async connectDatabase(): Promise<void> {
    try {
      await this.mongoConfig.connect();
    } catch (error) {
      console.error('❌ Falha ao conectar ao banco de dados:', error);
    }
  }

  private startJobs(): void {
    try {
      this.relatoriosJob.iniciarJobs();
    } catch (error) {
      console.error('❌ Falha ao iniciar jobs:', error);
    }
  }

  public async shutdown(): Promise<void> {
    console.log('🔄 Iniciando shutdown graceful...');
    await this.mongoConfig.disconnect();
    console.log('✅ Shutdown concluído');
  }
}

export default App;
