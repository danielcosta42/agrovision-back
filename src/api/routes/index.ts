import { Router } from 'express';
import clientesRoutes from './clientes.routes';

const routes = Router();
routes.use('/clientes', clientesRoutes);

export default routes;
