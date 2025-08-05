import { Router } from 'express';
import { AuthController } from '../../modules/auth/controllers/AuthController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { permissionsMiddleware } from '../middlewares/permissions.middleware';
import { Role } from '../../modules/users/models/User';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Fazer login no sistema
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *                 example: "admin@agrovision.com"
 *               senha:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: "senha123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login realizado com sucesso"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticação
 *                 expiresIn:
 *                   type: string
 *                   description: Tempo de expiração do token
 *                   example: "24h"
 *       400:
 *         description: Dados obrigatórios não fornecidos
 *       401:
 *         description: Credenciais inválidas ou conta inativa
 */
router.post('/login', authController.login.bind(authController));

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar novo usuário (apenas para admins)
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome completo do usuário
 *                 example: "João Silva"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *                 example: "joao@agrovision.com"
 *               senha:
 *                 type: string
 *                 description: Senha do usuário
 *                 minLength: 6
 *                 example: "senha123"
 *               telefone:
 *                 type: string
 *                 description: Telefone do usuário
 *                 example: "(11) 99999-9999"
 *               role:
 *                 type: string
 *                 enum: [admin, manager, operator, viewer]
 *                 description: Papel do usuário no sistema
 *                 example: "viewer"
 *               tipoAcesso:
 *                 type: string
 *                 enum: [global, cliente-especifico]
 *                 description: Tipo de acesso do usuário
 *                 example: "cliente-especifico"
 *               clientesVinculados:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: IDs dos clientes vinculados ao usuário
 *                 example: ["64f8b1234567890123456789"]
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário criado com sucesso"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados obrigatórios não fornecidos
 *       409:
 *         description: Email já cadastrado
 *       403:
 *         description: Acesso negado - apenas admins podem registrar usuários
 */
router.post('/register', 
  authMiddleware, 
  permissionsMiddleware.requireRoles([Role.ADMIN]), 
  authController.register.bind(authController)
);

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary: Verificar se o token é válido
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token inválido ou expirado
 */
router.get('/verify', 
  authMiddleware, 
  authController.verifyToken.bind(authController)
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Fazer logout do sistema
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout realizado com sucesso"
 *                 instruction:
 *                   type: string
 *                   example: "Remova o token do lado cliente"
 */
router.post('/logout', 
  authMiddleware, 
  authController.logout.bind(authController)
);

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Alterar senha do usuário
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senhaAtual
 *               - novaSenha
 *             properties:
 *               senhaAtual:
 *                 type: string
 *                 description: Senha atual do usuário
 *                 example: "senhaAntiga123"
 *               novaSenha:
 *                 type: string
 *                 description: Nova senha do usuário
 *                 minLength: 6
 *                 example: "novaSenha456"
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Senha alterada com sucesso"
 *       400:
 *         description: Dados obrigatórios não fornecidos
 *       401:
 *         description: Senha atual incorreta
 *       404:
 *         description: Usuário não encontrado
 */
router.put('/change-password', 
  authMiddleware, 
  authController.changePassword.bind(authController)
);

export default router;
