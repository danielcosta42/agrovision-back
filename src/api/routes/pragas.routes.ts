import { Router } from 'express';
import { PragaController } from '../../modules/pragas/controllers/PragaController';

const router = Router();
const pragaController = new PragaController();

router.get('/', (req, res) => pragaController.index(req, res));
router.get('/:id', (req, res) => pragaController.show(req, res));
router.post('/', (req, res) => pragaController.store(req, res));
router.put('/:id', (req, res) => pragaController.update(req, res));
router.delete('/:id', (req, res) => pragaController.delete(req, res));

export default router;
