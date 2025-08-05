"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminUser = createAdminUser;
exports.resetAdminPassword = resetAdminPassword;
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../src/modules/users/models/User");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function createAdminUser() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Conectar ao MongoDB
            yield mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agrovision');
            console.log('✅ Conectado ao MongoDB');
            // Verificar se já existe um usuário admin
            const existingAdmin = yield User_1.User.findOne({
                role: 'admin',
                tipoAcesso: 'global'
            });
            if (existingAdmin) {
                console.log('⚠️  Já existe um usuário administrador global no sistema');
                console.log(`Email: ${existingAdmin.email}`);
                return;
            }
            // Criar usuário administrador padrão
            const adminUser = new User_1.User({
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
            yield adminUser.save();
            console.log('✅ Usuário administrador criado com sucesso!');
            console.log('📧 Email: admin@agrovision.com');
            console.log('🔑 Senha: admin123456');
            console.log('⚠️  IMPORTANTE: Altere a senha padrão após o primeiro login!');
        }
        catch (error) {
            console.error('❌ Erro ao criar usuário administrador:', error);
        }
        finally {
            yield mongoose_1.default.disconnect();
            console.log('🔌 Desconectado do MongoDB');
        }
    });
}
// Função para redefinir senha do admin
function resetAdminPassword() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agrovision');
            console.log('✅ Conectado ao MongoDB');
            const admin = yield User_1.User.findOne({
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
            yield admin.save();
            console.log('✅ Senha do administrador redefinida com sucesso!');
            console.log('📧 Email: admin@agrovision.com');
            console.log('🔑 Nova senha: admin123456');
        }
        catch (error) {
            console.error('❌ Erro ao redefinir senha:', error);
        }
        finally {
            yield mongoose_1.default.disconnect();
        }
    });
}
// Verificar argumentos da linha de comando
const args = process.argv.slice(2);
if (args.includes('--reset-password')) {
    resetAdminPassword();
}
else {
    createAdminUser();
}
