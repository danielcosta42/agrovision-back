import { Router } from 'express';
import { CulturaController } from '../../modules/culturas/controllers/CulturaController';

const router = Router();
const culturaController = new CulturaController();

/**
 * @swagger
 * /api/culturas:
 *   get:
 *     summary: Listar todas as culturas
 *     description: Retorna uma lista paginada de todas as culturas cadastradas
 *     tags: [Culturas]
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
 *         description: Busca por nome da cultura
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [graos, frutas, hortalicas, cereais, leguminosas, oleaginosas, outros]
 *         description: Filtrar por tipo de cultura
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ativa, inativa, descontinuada]
 *         description: Filtrar por status
 *     responses:
 *       200:
 *         description: Lista de culturas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Cultura'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', (req, res) => culturaController.index(req, res));

/**
 * @swagger
 * /api/culturas/{id}:
 *   get:
 *     summary: Buscar cultura por ID
 *     description: Retorna os detalhes de uma cultura específica
 *     tags: [Culturas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único da cultura
 *     responses:
 *       200:
 *         description: Cultura encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cultura'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', (req, res) => culturaController.show(req, res));

/**
 * @swagger
 * /api/culturas:
 *   post:
 *     summary: Criar nova cultura
 *     description: Cadastra uma nova cultura no sistema
 *     tags: [Culturas]
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
 *               - tipo
 *               - cicloVida
 *             properties:
 *               nome:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "Soja"
 *               nomeComum:
 *                 type: string
 *                 maxLength: 100
 *                 example: "Soja"
 *               nomeCientifico:
 *                 type: string
 *                 maxLength: 150
 *                 example: "Glycine max"
 *               tipo:
 *                 type: string
 *                 enum: [graos, frutas, hortalicas, cereais, leguminosas, oleaginosas, outros]
 *                 example: "oleaginosas"
 *               variedade:
 *                 type: string
 *                 maxLength: 100
 *                 example: "TMG 7062"
 *               cicloVida:
 *                 type: number
 *                 minimum: 1
 *                 example: 120
 *               descricao:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Cultura oleaginosa de ciclo anual"
 *               status:
 *                 type: string
 *                 enum: [ativa, inativa, descontinuada]
 *                 default: "ativa"
 *           examples:
 *             soja:
 *               summary: Cultura de Soja
 *               value:
 *                 nome: "Soja"
 *                 nomeComum: "Soja"
 *                 nomeCientifico: "Glycine max"
 *                 tipo: "oleaginosas"
 *                 variedade: "TMG 7062"
 *                 cicloVida: 120
 *                 descricao: "Cultura oleaginosa de alta produtividade"
 *             milho:
 *               summary: Cultura de Milho
 *               value:
 *                 nome: "Milho"
 *                 nomeComum: "Milho"
 *                 nomeCientifico: "Zea mays"
 *                 tipo: "cereais"
 *                 variedade: "DKB 390"
 *                 cicloVida: 140
 *                 descricao: "Cereal de alto valor nutricional"
 *     responses:
 *       201:
 *         description: Cultura criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cultura'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', (req, res) => culturaController.store(req, res));

/**
 * @swagger
 * /api/culturas/{id}:
 *   put:
 *     summary: Atualizar cultura
 *     description: Atualiza os dados de uma cultura existente
 *     tags: [Culturas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único da cultura
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               nomeComum:
 *                 type: string
 *                 maxLength: 100
 *               nomeCientifico:
 *                 type: string
 *                 maxLength: 150
 *               variedade:
 *                 type: string
 *                 maxLength: 100
 *               cicloVida:
 *                 type: number
 *                 minimum: 1
 *               descricao:
 *                 type: string
 *                 maxLength: 500
 *               status:
 *                 type: string
 *                 enum: [ativa, inativa, descontinuada]
 *     responses:
 *       200:
 *         description: Cultura atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cultura'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id', (req, res) => culturaController.update(req, res));

/**
 * @swagger
 * /api/culturas/{id}:
 *   delete:
 *     summary: Excluir cultura
 *     description: Remove uma cultura do sistema (soft delete)
 *     tags: [Culturas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único da cultura
 *     responses:
 *       200:
 *         description: Cultura excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', (req, res) => culturaController.delete(req, res));

export default router;
