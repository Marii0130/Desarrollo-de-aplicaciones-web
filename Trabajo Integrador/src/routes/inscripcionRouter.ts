import express from "express";
import { insertar, eliminar, consultarTodos, modificar, actualizar, validar/*, buscarCursosPorEstudiante, buscarEstudiantesPorCurso */} from '../controllers/inscripcionController';
import { AppDataSource } from '../db/conexion'; // Asegúrate de ajustar la importación
import { Estudiante } from '../models/EstudianteModel'; // Asegúrate de ajustar la importación
import { Curso } from '../models/CursoModel'; // Asegúrate de ajustar la importación
import { CursoEstudiante } from '../models/CursoEstudianteModel';

const router = express.Router();
/*
router.get('/listarEstudiantesPorCurso/:curso_id', buscarEstudiantesPorCurso);

// Listar cursos por estudiante
router.get('/listarCursosPorEstudiante/:estudiante_id', buscarCursosPorEstudiante);*/

// Ruta para crear inscripciones
router.get('/crearInscripcion', async (req, res) => {
    try {
        const estudiantes = await AppDataSource.getRepository(Estudiante).find(); // Obtener la lista de estudiantes
        const cursos = await AppDataSource.getRepository(Curso).find(); // Obtener la lista de cursos

        res.render('crearInscripcion', {
            pagina: 'Crear Inscripción',
            estudiantes, // Pasar estudiantes a la vista
            cursos // Pasar cursos a la vista
        });
    } catch (error) {
        console.error('Error al obtener estudiantes o cursos:', error);
        res.status(500).send('Error al cargar la página de creación de inscripciones');
    }
});

router.get('/listarInscripciones', consultarTodos);
router.post('/crearInscripcion', validar(), insertar);
router.delete('/:curso_id/:estudiante_id', eliminar);
router.get('/modificarInscripcion/:curso_id/:estudiante_id', modificar);

router.put('/:curso_id/:estudiante_id', validar(), actualizar);

export default router;