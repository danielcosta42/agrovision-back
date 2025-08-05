import mongoose from 'mongoose';
import { User } from '../src/modules/users/models/User';
import dotenv from 'dotenv';

dotenv.config();

async function createAdminUser() {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agrovision');
    console.log('✅ Conectado ao MongoDB');

    // Verificar se já existe um usuário admin
    const existingAdmin = await User.findOne({ 
      role: 'admin',
      tipoAcesso: 'global' 
    });

    if (existingAdmin) {
      console.log('⚠️  Já existe um usuário administrador global no sistema');
      console.log(`Email: ${existingAdmin.email}`);
      return;
    }

    // Criar usuário administrador padrão
    const adminUser = new User({
      nome: 'Administrador Sistema',
      email: 'admin@agrovision.com',
      senha: 'admin123456', // Será hasheada automaticamente pelo middleware
      role: 'admin',
      status: 'ativo',
      tipoAcesso: 'global',
      clientesVinculados: [], // Admin global não precisa de clientes vinculados
      permissoes: {
        areas: { visualizar: true, criar: true, editar: true, excluir: true },
        clientes: { visualizar: true, criar: true, editar: true, excluir: true },
        culturas: { visualizar: true, criar: true, editar: true, excluir: true },
        usuarios: { visualizar: true, criar: true, editar: true, excluir: true },
        relatorios: { visualizar: true, exportar: true }
      },
      tentativasLogin: 0,
      dataCriacao: new Date(),
      dataAtualizacao: new Date()
    });

    await adminUser.save();

    console.log('✅ Usuário administrador criado com sucesso!');
    console.log('📧 Email: admin@agrovision.com');
    console.log('🔑 Senha: admin123456');
    console.log('⚠️  IMPORTANTE: Altere a senha padrão após o primeiro login!');

  } catch (error) {
    console.error('❌ Erro ao criar usuário administrador:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado do MongoDB');
  }
}

// Função para redefinir senha do admin
async function resetAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agrovision');
    console.log('✅ Conectado ao MongoDB');

    const admin = await User.findOne({ 
      email: 'admin@agrovision.com',
      role: 'admin' 
    });

    if (!admin) {
      console.log('❌ Usuário administrador não encontrado');
      return;
    }

    admin.senha = 'admin123456'; // Nova senha será hasheada
    admin.tentativasLogin = 0;
    admin.bloqueadoAte = undefined;
    await admin.save();

    console.log('✅ Senha do administrador redefinida com sucesso!');
    console.log('📧 Email: admin@agrovision.com');
    console.log('🔑 Nova senha: admin123456');

  } catch (error) {
    console.error('❌ Erro ao redefinir senha:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Verificar argumentos da linha de comando
const args = process.argv.slice(2);

if (args.includes('--reset-password')) {
  resetAdminPassword();
} else {
  createAdminUser();
}

export { createAdminUser, resetAdminPassword };
