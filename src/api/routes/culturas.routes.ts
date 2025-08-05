import { Router } from 'express';
import { CulturaController } from '../../modules/culturas/controllers/CulturaController';

const router = Router();
const culturaController = new CulturaController();

router.get('/', (req, res) => culturaController.index(req, res));
router.get('/:id', (req, res) => culturaController.show(req, res));
router.post('/', (req, res) => culturaController.store(req, res));
router.put('/:id', (req, res) => culturaController.update(req, res));
router.delete('/:id', (req, res) => culturaController.delete(req, res));

export default router;
