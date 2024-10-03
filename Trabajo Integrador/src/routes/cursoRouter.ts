import express from 'express';
import { AppDataSource } from '../db/conexion';
import {Profesor} from '../models/ProfesorModel';
import { consultarTodos, consultarUno, eliminar, insertar, modificar, mostrarFormularioCrear/*, validar */} from '../controllers/cursoController';

const router = express.Router();

router.get('/listarCursos',consultarTodos);

router.get('/crearCurso', mostrarFormularioCrear);
router.post('/',insertar);

router.get('/modificarCurso/:id', async (req, res) => {
    try {
        const curso = await consultarUno(req, res); 
        if (!curso) {
            return res.status(404).send('Curso no encontrado');
        }

        const profesorRepository = AppDataSource.getRepository(Profesor);
        const profesores = await profesorRepository.find(); 

        res.render('modificarCurso', {
            curso,
            profesores,
            pagina: 'Modificar Curso'
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
router.put('/:id', modificar); 

router.delete('/:id', eliminar);

export default router