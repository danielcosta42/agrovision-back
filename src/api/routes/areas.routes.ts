import { Router } from 'express';
import { AreaController } from '../../modules/areas/controllers/AreaController';

const router = Router();
const areaController = new AreaController();

router.get('/', (req, res) => areaController.index(req, res));
router.get('/:id', (req, res) => areaController.show(req, res));
router.post('/', (req, res) => areaController.store(req, res));
router.put('/:id', (req, res) => areaController.update(req, res));
router.delete('/:id', (req, res) => areaController.delete(req, res));

export default router;
