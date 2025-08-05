import { Router } from 'express';
import { PragaController } from '../../modules/pragas/controllers/PragaController';

const router = Router();
const pragaController = new PragaController();

/**
 * @swagger
 * /api/pragas:
 *   get:
 *     summary: Listar todas as pragas
 *     description: Retorna uma lista paginada de todas as pragas cadastradas
 *     tags: [Pragas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Número de itens por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Busca por nome científico ou nome comum
 *       - in: query
 *         name: culturaId
 *         schema:
 *           type: string
 *         description: Filtrar por ID da cultura
 *       - in: query
 *         name: nivelSeveridade
 *         schema:
 *           type: string
 *           enum: [baixo, medio, alto, critico]
 *         description: Filtrar por nível de severidade
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [nome, nomeComum, nomeCientifico, nivelSeveridade, dataCriacao]
 *           default: dataCriacao
 *         description: Campo para ordenação
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Direção da ordenação
 *     responses:
 *       200:
 *         description: Lista de pragas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pragas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Praga'
 *                 total:
 *                   type: integer
 *                   description: Total de registros
 *                 page:
 *                   type: integer
 *                   description: Página atual
 *                 totalPages:
 *                   type: integer
 *                   description: Total de páginas
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', (req, res) => pragaController.index(req, res));

/**
 * @swagger
 * /api/pragas/{id}:
 *   get:
 *     summary: Buscar praga por ID
 *     description: Retorna os detalhes de uma praga específica
 *     tags: [Pragas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da praga
 *     responses:
 *       200:
 *         description: Praga encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Praga'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', (req, res) => pragaController.show(req, res));

/**
 * @swagger
 * /api/pragas:
 *   post:
 *     summary: Criar nova praga
 *     description: Cadastra uma nova praga no sistema
 *     tags: [Pragas]
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
 *               - nomeComum
 *               - nomeCientifico
 *               - culturaId
 *               - nivelSeveridade
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome da praga
 *                 example: "Lagarta do Cartucho"
 *               nomeComum:
 *                 type: string
 *                 description: Nome comum da praga
 *                 example: "Lagarta do Cartucho"
 *               nomeCientifico:
 *                 type: string
 *                 description: Nome científico da praga
 *                 example: "Spodoptera frugiperda"
 *               culturaId:
 *                 type: string
 *                 description: ID da cultura afetada
 *                 example: "507f1f77bcf86cd799439011"
 *               nivelSeveridade:
 *                 type: string
 *                 enum: [baixo, medio, alto, critico]
 *                 description: Nível de severidade da praga
 *                 example: "alto"
 *               descricao:
 *                 type: string
 *                 description: Descrição detalhada da praga
 *                 example: "Praga que ataca principalmente o milho"
 *               sintomas:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de sintomas
 *                 example: ["Furos nas folhas", "Presença de lagartas"]
 *               metodosControle:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Métodos de controle
 *                 example: ["Inseticida", "Controle biológico"]
 *               periodoOcorrencia:
 *                 type: string
 *                 description: Período de ocorrência
 *                 example: "Verão"
 *               observacoes:
 *                 type: string
 *                 description: Observações adicionais
 *     responses:
 *       201:
 *         description: Praga criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Praga'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', (req, res) => pragaController.store(req, res));

/**
 * @swagger
 * /api/pragas/{id}:
 *   put:
 *     summary: Atualizar praga
 *     description: Atualiza os dados de uma praga existente
 *     tags: [Pragas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da praga
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome da praga
 *               nomeComum:
 *                 type: string
 *                 description: Nome comum da praga
 *               nomeCientifico:
 *                 type: string
 *                 description: Nome científico da praga
 *               culturaId:
 *                 type: string
 *                 description: ID da cultura afetada
 *               nivelSeveridade:
 *                 type: string
 *                 enum: [baixo, medio, alto, critico]
 *                 description: Nível de severidade da praga
 *               descricao:
 *                 type: string
 *                 description: Descrição detalhada da praga
 *               sintomas:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de sintomas
 *               metodosControle:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Métodos de controle
 *               periodoOcorrencia:
 *                 type: string
 *                 description: Período de ocorrência
 *               observacoes:
 *                 type: string
 *                 description: Observações adicionais
 *     responses:
 *       200:
 *         description: Praga atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Praga'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id', (req, res) => pragaController.update(req, res));

/**
 * @swagger
 * /api/pragas/{id}:
 *   delete:
 *     summary: Deletar praga
 *     description: Remove uma praga do sistema (soft delete)
 *     tags: [Pragas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da praga
 *     responses:
 *       200:
 *         description: Praga deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Praga deletada com sucesso"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', (req, res) => pragaController.delete(req, res));

export default router;
