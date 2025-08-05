import { Router } from 'express';
import { PerdaController } from '../../modules/perdas/controllers/PerdaController';

const router = Router();
const perdaController = new PerdaController();

router.get('/', (req, res) => perdaController.index(req, res));
router.get('/relatorio', (req, res) => perdaController.relatorioFinanceiro(req, res));
router.get('/:id', (req, res) => perdaController.show(req, res));
router.post('/', (req, res) => perdaController.store(req, res));
router.put('/:id', (req, res) => perdaController.update(req, res));
router.delete('/:id', (req, res) => perdaController.delete(req, res));

export default router;
