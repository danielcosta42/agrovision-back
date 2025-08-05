import { Router } from 'express';
import { ClienteController } from '../../modules/clientes/controllers/ClienteController';

const router = Router();
const clienteController = new ClienteController();

router.get('/', (req, res) => clienteController.index(req, res));
router.get('/:id', (req, res) => clienteController.show(req, res));
router.post('/', (req, res) => clienteController.store(req, res));
router.put('/:id', (req, res) => clienteController.update(req, res));
router.delete('/:id', (req, res) => clienteController.delete(req, res));

export default router;
