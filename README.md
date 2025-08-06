# AgroVision Backend - API de Gestão Agrícola

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript) ![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green?logo=mongodb)

API REST completa para sistema de gestão agrícola, desenvolvida em Node.js com TypeScript, MongoDB e arquitetura modular escalável.

## 🚀 Funcionalidades

- **API RESTful** completa com documentação Swagger
- **Autenticação JWT** com controle de sessões
- **CRUD Completo** para todas as entidades
- **Sistema de Permissões** baseado em roles
- **Upload de Arquivos** para imagens e documentos
- **Relatórios Automatizados** com agendamento
- **Logs Estruturados** para auditoria
- **Validação de Dados** robusta
- **Cache Redis** para performance
- **Rate Limiting** para segurança

## 🛠️ Tecnologias Utilizadas

- **Node.js 18.x** - Runtime JavaScript
- **TypeScript 5.x** - Linguagem tipada
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação via tokens
- **Swagger** - Documentação da API
- **Jest** - Framework de testes
- **Winston** - Sistema de logs
- **Redis** - Cache e sessões
- **Multer** - Upload de arquivos
- **Bcrypt** - Hash de senhas
- **Joi** - Validação de dados
- **Node-cron** - Agendamento de tarefas

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [MongoDB](https://www.mongodb.com/) (versão 6 ou superior)
- [Redis](https://redis.io/) (opcional, para cache)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

## 🔧 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/danielcosta42/agrovision.git
cd agrovision/agrovision-back
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
# Servidor
PORT=3001
NODE_ENV=development

# Banco de dados
MONGODB_URI=mongodb://localhost:27017/agrovision
MONGODB_TEST_URI=mongodb://localhost:27017/agrovision_test

# JWT
JWT_SECRET=seu_jwt_secret_muito_seguro_aqui
JWT_EXPIRES_IN=7d

# Redis (opcional)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Email (para relatórios)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app

# Upload de arquivos
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# Logs
LOG_LEVEL=info
LOG_FILE=./logs/app.log
```

### 4. Configure o banco de dados
```bash
# Inicie o MongoDB
mongod

# Execute as migrações (se houver)
npm run migrate
```

### 5. Crie o usuário administrador
```bash
npm run create-admin
```

### 6. Execute o projeto em desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

A API estará disponível em `http://localhost:3001`

## 🐳 Execução com Docker

### Usando Docker Compose (Recomendado)
```bash
# Na raiz do projeto agrovision-back
docker-compose up -d
```

### Build manual da imagem
```bash
docker build -t agrovision-backend .
docker run -p 3001:3001 -e MONGODB_URI=mongodb://host.docker.internal:27017/agrovision agrovision-backend
```

## 📦 Build para Produção

### Build TypeScript
```bash
npm run build
# ou
yarn build
```

### Executar build de produção
```bash
npm start
# ou
yarn start
```

## 🗂️ Estrutura do Projeto

```
src/
├── api/                    # Camada de API
│   ├── routes/            # Definição de rotas
│   │   ├── clientes.routes.ts
│   │   ├── areas.routes.ts
│   │   ├── culturas.routes.ts
│   │   ├── pragas.routes.ts
│   │   ├── perdas.routes.ts
│   │   └── auth.routes.ts
│   └── middlewares/       # Middlewares globais
├── modules/               # Módulos da aplicação
│   ├── clientes/         # Módulo de clientes
│   │   ├── controllers/   # Controllers
│   │   ├── services/      # Regras de negócio
│   │   ├── repositories/  # Acesso a dados
│   │   ├── models/        # Modelos MongoDB
│   │   └── dtos/          # Data Transfer Objects
│   ├── areas/            # Módulo de áreas
│   ├── culturas/         # Módulo de culturas
│   ├── pragas/           # Módulo de pragas
│   ├── perdas/           # Módulo de perdas
│   ├── usuarios/         # Módulo de usuários
│   └── auth/             # Módulo de autenticação
├── shared/               # Código compartilhado
│   ├── errors/           # Tratamento de erros
│   ├── middlewares/      # Middlewares específicos
│   ├── utils/            # Utilitários
│   └── validators/       # Validadores
├── config/               # Configurações
│   ├── database.ts       # Configuração do MongoDB
│   ├── redis.ts          # Configuração do Redis
│   └── swagger.ts        # Configuração do Swagger
└── server.ts             # Ponto de entrada
```

## 📚 API Endpoints

### Autenticação
```
POST   /api/auth/login     # Login de usuário
POST   /api/auth/register  # Registro de usuário
POST   /api/auth/refresh   # Renovar token
POST   /api/auth/logout    # Logout
```

### Clientes
```
GET    /api/clientes       # Listar clientes
GET    /api/clientes/:id   # Obter cliente
POST   /api/clientes       # Criar cliente
PUT    /api/clientes/:id   # Atualizar cliente
DELETE /api/clientes/:id   # Deletar cliente
```

### Áreas
```
GET    /api/areas          # Listar áreas
GET    /api/areas/:id      # Obter área
POST   /api/areas          # Criar área
PUT    /api/areas/:id      # Atualizar área
DELETE /api/areas/:id      # Deletar área
```

### Culturas
```
GET    /api/culturas       # Listar culturas
GET    /api/culturas/:id   # Obter cultura
POST   /api/culturas       # Criar cultura
PUT    /api/culturas/:id   # Atualizar cultura
DELETE /api/culturas/:id   # Deletar cultura
```

### Pragas
```
GET    /api/pragas         # Listar pragas
GET    /api/pragas/:id     # Obter praga
POST   /api/pragas         # Criar praga
PUT    /api/pragas/:id     # Atualizar praga
DELETE /api/pragas/:id     # Deletar praga
```

### Perdas
```
GET    /api/perdas         # Listar perdas
GET    /api/perdas/:id     # Obter perda
POST   /api/perdas         # Criar perda
PUT    /api/perdas/:id     # Atualizar perda
DELETE /api/perdas/:id     # Deletar perda
```

### Usuários
```
GET    /api/usuarios       # Listar usuários
GET    /api/usuarios/:id   # Obter usuário
POST   /api/usuarios       # Criar usuário
PUT    /api/usuarios/:id   # Atualizar usuário
DELETE /api/usuarios/:id   # Deletar usuário
```

## 📖 Documentação da API

A documentação completa da API está disponível via Swagger:

- **Desenvolvimento**: http://localhost:3001/api-docs
- **Produção**: https://api.agrovision.com/api-docs

### Principais Features da Documentação:

- **Schemas completos** de todas as entidades
- **Exemplos de requisições** para cada endpoint
- **Códigos de resposta** detalhados
- **Autenticação** via interface
- **Teste direto** dos endpoints

## 🔐 Autenticação e Autorização

### JWT Token
```javascript
// Header da requisição
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Níveis de Acesso
- **Admin**: Acesso total ao sistema
- **Manager**: Gestão de clientes e áreas
- **Operator**: Operações básicas
- **Viewer**: Apenas visualização

### Exemplo de Uso
```javascript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@agrovision.com',
    senha: 'admin123456'
  })
});

const { token } = await response.json();

// Usar token nas próximas requisições
const clientsResponse = await fetch('/api/clientes', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## 🧪 Testes

### Executar todos os testes
```bash
npm test
# ou
yarn test
```

### Testes com coverage
```bash
npm run test:coverage
# ou
yarn test:coverage
```

### Testes de integração
```bash
npm run test:integration
# ou
yarn test:integration
```

### Testes unitários apenas
```bash
npm run test:unit
# ou
yarn test:unit
```

## 📊 Monitoramento e Logs

### Health Check
```
GET /health
```

### Logs estruturados
```javascript
// Os logs são salvos em ./logs/app.log
{
  "timestamp": "2025-08-05T21:00:00.000Z",
  "level": "info",
  "message": "Cliente criado com sucesso",
  "userId": "66b1a2c3d4e5f6789abcdef0",
  "clienteId": "66b1a2c3d4e5f6789abcdef1"
}
```

### Métricas importantes
- Tempo de resposta das APIs
- Número de requisições por endpoint
- Erros e exceções
- Uso de memória e CPU

## 🚀 Deploy

### Deploy no Heroku
```bash
# Instalar Heroku CLI
heroku create agrovision-api

# Configurar variáveis de ambiente
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=...

# Deploy
git push heroku main
```

### Deploy no AWS EC2
```bash
# Conectar ao servidor
ssh -i key.pem ubuntu@ec2-instance

# Clonar repositório
git clone https://github.com/danielcosta42/agrovision.git
cd agrovision/agrovision-back

# Instalar dependências
npm install --production

# Configurar PM2
npm install -g pm2
pm2 start ecosystem.config.js

# Configurar nginx
sudo nginx -s reload
```

### Deploy com Docker
```bash
# Build da imagem
docker build -t agrovision-api .

# Push para registry
docker tag agrovision-api:latest registry.com/agrovision-api:latest
docker push registry.com/agrovision-api:latest

# Deploy no servidor
docker pull registry.com/agrovision-api:latest
docker run -d -p 3001:3001 --env-file .env agrovision-api:latest
```

## 📚 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor em desenvolvimento |
| `npm run build` | Compila TypeScript |
| `npm start` | Inicia servidor de produção |
| `npm test` | Executa todos os testes |
| `npm run test:watch` | Executa testes em modo watch |
| `npm run test:coverage` | Executa testes com coverage |
| `npm run lint` | Executa linting |
| `npm run lint:fix` | Corrige problemas de linting |
| `npm run create-admin` | Cria usuário administrador |
| `npm run migrate` | Executa migrações |
| `npm run seed` | Popula banco com dados de teste |

## 🔧 Configurações Avançadas

### Cache Redis
```javascript
// Configuração de cache
const cacheConfig = {
  ttl: 300, // 5 minutos
  checkPeriod: 600, // 10 minutos
  errorOnMissing: false
};
```

### Rate Limiting
```javascript
// Limite de requisições
const limiter = {
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: 'Muitas requisições, tente novamente em 15 minutos'
};
```

### Upload de Arquivos
```javascript
// Configuração de upload
const uploadConfig = {
  destination: './uploads',
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
    cb(null, allowedMimes.includes(file.mimetype));
  }
};
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código

- Use **TypeScript** para tipagem estática
- Siga o **ESLint** configurado
- Escreva **testes** para novas funcionalidades
- Documente **APIs** no Swagger
- Use **commits semânticos**

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para suporte técnico:
- 📧 Email: dev@agrovision.com
- 📋 Issues: [GitHub Issues](https://github.com/danielcosta42/agrovision/issues)
- 📖 API Docs: http://localhost:3001/api-docs
- 💬 Slack: #agrovision-dev

## 👥 Equipe

- **Daniel Costa** - Arquiteto de Software
- **AgroVision Backend Team** - Desenvolvimento e Manutenção

---

Desenvolvido com ❤️ pela equipe AgroVision Backend