import { MongoConfig } from '../mongo.config';

/**
 * Migration para criar índices iniciais no MongoDB
 * Execute: npm run migration:create-indexes
 */
export class CreateIndexesMigration {
  private mongoConfig: MongoConfig;

  constructor() {
    this.mongoConfig = MongoConfig.getInstance();
  }

  async up(): Promise<void> {
    console.log('🔄 Executando migration: CreateIndexes');
    
    try {
      await this.mongoConfig.connect();
      const db = this.mongoConfig.getConnection()?.connection.db;

      if (!db) {
        throw new Error('Conexão com o banco não estabelecida');
      }

      // Índices para Clientes
      await db.collection('clientes').createIndex({ email: 1 }, { unique: true });
      await db.collection('clientes').createIndex({ cpf: 1 }, { unique: true, sparse: true });
      await db.collection('clientes').createIndex({ cnpj: 1 }, { unique: true, sparse: true });
      
      // Índices para Áreas
      await db.collection('areas').createIndex({ clienteId: 1 });
      await db.collection('areas').createIndex({ 'localizacao.latitude': 1, 'localizacao.longitude': 1 });
      
      // Índices para Culturas
      await db.collection('culturas').createIndex({ areaId: 1 });
      await db.collection('culturas').createIndex({ estadoAtual: 1 });
      await db.collection('culturas').createIndex({ dataPlantio: 1 });
      
      // Índices para Pragas
      await db.collection('pragas').createIndex({ culturaId: 1 });
      await db.collection('pragas').createIndex({ dataDeteccao: 1 });
      await db.collection('pragas').createIndex({ gravidade: 1 });
      
      // Índices para Perdas
      await db.collection('perdas').createIndex({ culturaId: 1 });
      await db.collection('perdas').createIndex({ tipo: 1 });
      await db.collection('perdas').createIndex({ dataOcorrencia: 1 });
      await db.collection('perdas').createIndex({ valorEstimado: 1 });

      console.log('✅ Índices criados com sucesso');
    } catch (error) {
      console.error('❌ Erro ao criar índices:', error);
      throw error;
    }
  }

  async down(): Promise<void> {
    console.log('🔄 Revertendo migration: CreateIndexes');
    
    try {
      const db = this.mongoConfig.getConnection()?.connection.db;

      if (!db) {
        throw new Error('Conexão com o banco não estabelecida');
      }

      // Remover índices personalizados (mantém apenas _id)
      const collections = ['clientes', 'areas', 'culturas', 'pragas', 'perdas'];
      
      for (const collectionName of collections) {
        const collection = db.collection(collectionName);
        const indexes = await collection.indexes();
        
        for (const index of indexes) {
          if (index.name !== '_id_') {
            await collection.dropIndex(index.name);
            console.log(`🗑️  Índice removido: ${collectionName}.${index.name}`);
          }
        }
      }

      console.log('✅ Índices removidos com sucesso');
    } catch (error) {
      console.error('❌ Erro ao remover índices:', error);
      throw error;
    }
  }
}

// Execute a migration se chamado diretamente
if (require.main === module) {
  const migration = new CreateIndexesMigration();
  
  const command = process.argv[2];
  
  if (command === 'up') {
    migration.up()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else if (command === 'down') {
    migration.down()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else {
    console.log('Uso: node migration.js [up|down]');
    process.exit(1);
  }
}
