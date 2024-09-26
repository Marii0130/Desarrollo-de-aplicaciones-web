import express from 'express';
const router = express.Router();
import { calificar, cancelarInscripcion, consultarInscripciones, consultarxAlumno, consultarxCurso, inscribir } from '../controllers/inscripcionController';

router.get('/',consultarInscripciones);
router.get('/xAlumno/:id',consultarxAlumno);
router.get('/xCurso/:id',consultarxCurso);

router.post('/',inscribir);
router.put('/',calificar);
router.delete('/:estudiante-id/:curso_id',cancelarInscripcion);

export default router;