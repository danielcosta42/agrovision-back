import { Router } from 'express';
import { PerdaController } from '../../modules/perdas/controllers/PerdaController';

const router = Router();
const perdaController = new PerdaController();

/**
 * @swagger
 * /api/perdas:
 *   get:
 *     summary: Listar todas as perdas
 *     description: Retorna uma lista paginada de todas as perdas registradas
 *     tags: [Perdas]
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
 *         description: Busca por tipo ou descrição da perda
 *       - in: query
 *         name: culturaId
 *         schema:
 *           type: string
 *         description: Filtrar por ID da cultura
 *       - in: query
 *         name: pragaId
 *         schema:
 *           type: string
 *         description: Filtrar por ID da praga
 *       - in: query
 *         name: tipoPerda
 *         schema:
 *           type: string
 *           enum: [clima, praga, doenca, manejo, outros]
 *         description: Filtrar por tipo de perda
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial do filtro (YYYY-MM-DD)
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final do filtro (YYYY-MM-DD)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [dataOcorrencia, tipoPerda, quantidadePerdida, valorEstimado, dataCriacao]
 *           default: dataOcorrencia
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
 *         description: Lista de perdas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 perdas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Perda'
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
router.get('/', (req, res) => perdaController.index(req, res));

/**
 * @swagger
 * /api/perdas/relatorio:
 *   get:
 *     summary: Relatório financeiro de perdas
 *     description: Retorna um relatório consolidado com dados financeiros das perdas
 *     tags: [Perdas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: clienteId
 *         schema:
 *           type: string
 *         description: Filtrar por ID do cliente
 *       - in: query
 *         name: culturaId
 *         schema:
 *           type: string
 *         description: Filtrar por ID da cultura
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial do relatório (YYYY-MM-DD)
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final do relatório (YYYY-MM-DD)
 *       - in: query
 *         name: tipoPerda
 *         schema:
 *           type: string
 *           enum: [clima, praga, doenca, manejo, outros]
 *         description: Filtrar por tipo de perda
 *       - in: query
 *         name: agrupamento
 *         schema:
 *           type: string
 *           enum: [mes, trimestre, ano, tipo, cultura]
 *           default: mes
 *         description: Tipo de agrupamento dos dados
 *     responses:
 *       200:
 *         description: Relatório financeiro gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resumo:
 *                   type: object
 *                   properties:
 *                     totalPerdas:
 *                       type: integer
 *                       description: Total de perdas no período
 *                     valorTotalEstimado:
 *                       type: number
 *                       description: Valor total estimado das perdas
 *                     quantidadeTotalPerdida:
 *                       type: number
 *                       description: Quantidade total perdida
 *                     mediaPorPerda:
 *                       type: number
 *                       description: Valor médio por perda
 *                 porTipo:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       tipo:
 *                         type: string
 *                       quantidade:
 *                         type: integer
 *                       valorTotal:
 *                         type: number
 *                       percentual:
 *                         type: number
 *                 porPeriodo:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       periodo:
 *                         type: string
 *                       quantidade:
 *                         type: integer
 *                       valorTotal:
 *                         type: number
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/relatorio', (req, res) => perdaController.relatorioFinanceiro(req, res));

/**
 * @swagger
 * /api/perdas/{id}:
 *   get:
 *     summary: Buscar perda por ID
 *     description: Retorna os detalhes de uma perda específica
 *     tags: [Perdas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da perda
 *     responses:
 *       200:
 *         description: Perda encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Perda'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', (req, res) => perdaController.show(req, res));

/**
 * @swagger
 * /api/perdas:
 *   post:
 *     summary: Registrar nova perda
 *     description: Cadastra uma nova perda no sistema
 *     tags: [Perdas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - culturaId
 *               - tipoPerda
 *               - dataOcorrencia
 *               - quantidadePerdida
 *               - unidadeMedida
 *             properties:
 *               culturaId:
 *                 type: string
 *                 description: ID da cultura afetada
 *                 example: "507f1f77bcf86cd799439011"
 *               pragaId:
 *                 type: string
 *                 description: ID da praga (se aplicável)
 *                 example: "507f1f77bcf86cd799439012"
 *               tipoPerda:
 *                 type: string
 *                 enum: [clima, praga, doenca, manejo, outros]
 *                 description: Tipo da perda
 *                 example: "praga"
 *               dataOcorrencia:
 *                 type: string
 *                 format: date
 *                 description: Data da ocorrência
 *                 example: "2024-03-15"
 *               quantidadePerdida:
 *                 type: number
 *                 description: Quantidade perdida
 *                 example: 150.5
 *               unidadeMedida:
 *                 type: string
 *                 description: Unidade de medida
 *                 example: "kg"
 *               valorEstimado:
 *                 type: number
 *                 description: Valor estimado da perda
 *                 example: 1250.00
 *               descricao:
 *                 type: string
 *                 description: Descrição detalhada da perda
 *                 example: "Ataque de lagarta do cartucho na plantação"
 *               causas:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de causas identificadas
 *                 example: ["Falta de monitoramento", "Condições climáticas favoráveis"]
 *               acoesCorretivas:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Ações corretivas tomadas
 *                 example: ["Aplicação de inseticida", "Intensificação do monitoramento"]
 *               observacoes:
 *                 type: string
 *                 description: Observações adicionais
 *     responses:
 *       201:
 *         description: Perda registrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Perda'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', (req, res) => perdaController.store(req, res));

/**
 * @swagger
 * /api/perdas/{id}:
 *   put:
 *     summary: Atualizar perda
 *     description: Atualiza os dados de uma perda existente
 *     tags: [Perdas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da perda
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               culturaId:
 *                 type: string
 *                 description: ID da cultura afetada
 *               pragaId:
 *                 type: string
 *                 description: ID da praga (se aplicável)
 *               tipoPerda:
 *                 type: string
 *                 enum: [clima, praga, doenca, manejo, outros]
 *                 description: Tipo da perda
 *               dataOcorrencia:
 *                 type: string
 *                 format: date
 *                 description: Data da ocorrência
 *               quantidadePerdida:
 *                 type: number
 *                 description: Quantidade perdida
 *               unidadeMedida:
 *                 type: string
 *                 description: Unidade de medida
 *               valorEstimado:
 *                 type: number
 *                 description: Valor estimado da perda
 *               descricao:
 *                 type: string
 *                 description: Descrição detalhada da perda
 *               causas:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de causas identificadas
 *               acoesCorretivas:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Ações corretivas tomadas
 *               observacoes:
 *                 type: string
 *                 description: Observações adicionais
 *     responses:
 *       200:
 *         description: Perda atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Perda'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id', (req, res) => perdaController.update(req, res));

/**
 * @swagger
 * /api/perdas/{id}:
 *   delete:
 *     summary: Deletar perda
 *     description: Remove uma perda do sistema (soft delete)
 *     tags: [Perdas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da perda
 *     responses:
 *       200:
 *         description: Perda deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Perda deletada com sucesso"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', (req, res) => perdaController.delete(req, res));

export default router;
