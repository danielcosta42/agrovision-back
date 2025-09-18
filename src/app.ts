import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Swagger
import { setupSwagger } from './shared/docs/swagger';

// Models - IMPORTANTE: Importar ANTES das rotas para registrar no mongoose
import './modules/users/models/User';
import './modules/clientes/models/Cliente';
import './modules/propriedades/models/Propriedade';
import './modules/culturas/models/Cultura';
import './modules/pragas/models/Praga';
import './modules/perdas/models/Perda';

// Routes
import clientesRoutes from './api/routes/clientes.routes';
import culturasRoutes from './api/routes/culturas.routes';
import pragasRoutes from './api/routes/pragas.routes';
import perdasRoutes from './api/routes/perdas.routes';
import usersRoutes from './api/routes/users.routes';
import authRoutes from './api/routes/auth.routes';
import propriedadesRoutes from './api/routes/propriedades.routes';

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
    this.setupSwagger();
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

  private setupSwagger(): void {
    setupSwagger(this.express);
  }

  private setupRoutes(): void {
    // Health check
    this.express.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // API routes
    this.express.use('/api/auth', authRoutes);

    // Protected routes
    this.express.use('/api/clientes', authMiddleware, clientesRoutes);
    this.express.use('/api/propriedades', authMiddleware, propriedadesRoutes);
    this.express.use('/api/culturas', authMiddleware, culturasRoutes);
    this.express.use('/api/pragas', authMiddleware, pragasRoutes);
    this.express.use('/api/perdas', authMiddleware, perdasRoutes);
    this.express.use('/api/users', authMiddleware, usersRoutes);

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
      console.log('✅ Modelos registrados e banco conectado');
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
