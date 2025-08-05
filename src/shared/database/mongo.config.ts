import mongoose from 'mongoose';

export class MongoConfig {
  private static instance: MongoConfig;
  private connection: typeof mongoose | null = null;

  private constructor() {}

  public static getInstance(): MongoConfig {
    if (!MongoConfig.instance) {
      MongoConfig.instance = new MongoConfig();
    }
    return MongoConfig.instance;
  }

  public async connect(): Promise<void> {
    try {
      const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/agrovision';
      
      this.connection = await mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as any);

      console.log('✅ Conectado ao MongoDB');
    } catch (error) {
      console.error('❌ Erro ao conectar ao MongoDB:', error);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    if (this.connection) {
      await mongoose.disconnect();
      console.log('🔌 Desconectado do MongoDB');
    }
  }

  public getConnection(): typeof mongoose | null {
    return this.connection;
  }
}
