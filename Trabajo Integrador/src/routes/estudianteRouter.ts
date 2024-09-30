import express from 'express';
import { consultarTodos, consultarUno, eliminar, insertar, modificar, validar } from '../controllers/estudianteController';

const router = express.Router();

router.get('/listarEstudiantes', consultarTodos);

router.get('/crearEstudiante', (req, res) => {
    res.render('crearEstudiante', {
        pagina: 'Crear Estudiante',
    });
});
router.post('/', validar(), insertar);

router.get('/modificarEstudiante/:id', async (req, res) => {
    try {
        const estudiante = await consultarUno(req, res); 
        if (!estudiante) {
            return res.status(404).send('Estudiante no encontrado');
        }
        res.render('modificarEstudiante', {
            estudiante, 
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
router.put('/:id', modificar); 

router.delete('/:id', eliminar);

export default router;