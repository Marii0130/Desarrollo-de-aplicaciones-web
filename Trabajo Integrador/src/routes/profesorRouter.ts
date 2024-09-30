import express from 'express';
import { consultarTodos, consultarUno, eliminar, insertar, modificar, validar } from '../controllers/profesorController';

const router = express.Router();

router.get('/listarProfesores',consultarTodos);

router.get('/crearProfesor', (req, res) => {
    res.render('crearProfesor', {
        pagina: 'Crear Profesor',
    });
});
router.post('/', validar(), insertar);

router.get('/modificarProfesor/:id', async (req, res) => {
    try {
        const profesor = await consultarUno(req, res); 
        if (!profesor) {
            return res.status(404).send('Profesor no encontrado');
        }
        res.render('modificarProfesor', {
            profesor, 
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});

router.put('/:id', modificar); 

//eliminar
router.delete('/:id', eliminar);

export default router;