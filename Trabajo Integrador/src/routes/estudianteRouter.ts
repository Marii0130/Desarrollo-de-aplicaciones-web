import express from 'express';
const router = express.Router();
//import { estudianteController } from '../controllers/estudianteController';
import { consultarTodos, consultarUno, eliminar, insertar, modificar } from '../controllers/estudianteController';

router.get('/',consultarTodos);
router.post('/',insertar);

router.route('/:id')
	.get(consultarUno)
	.put(modificar)
	.delete(eliminar);

export default router;