import App from './app';

const PORT = process.env.PORT || 3001;
const app = new App();

const server = app.express.listen(PORT, () => {
  console.log(`🚀 Servidor AgroVision rodando na porta ${PORT}`);
  console.log(`📖 Documentação: http://localhost:${PORT}/api/docs`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM recebido, iniciando shutdown...');
  
  server.close(async () => {
    await app.shutdown();
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT recebido, iniciando shutdown...');
  
  server.close(async () => {
    await app.shutdown();
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
