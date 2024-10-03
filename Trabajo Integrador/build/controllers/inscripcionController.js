"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buscarCursosPorEstudiante = exports.buscarEstudiantesPorCurso = exports.actualizar = exports.modificar = exports.consultarTodos = exports.eliminar = exports.insertar = exports.validar = void 0;
const express_validator_1 = require("express-validator");
const conexion_1 = require("../db/conexion");
const CursoEstudianteModel_1 = require("../models/CursoEstudianteModel");
const EstudianteModel_1 = require("../models/EstudianteModel");
const CursoModel_1 = require("../models/CursoModel");
let inscripcion;
const validar = () => [
    (0, express_validator_1.check)('estudiante_id')
        .notEmpty().withMessage('El ID del estudiante es obligatorio')
        .isNumeric().withMessage('El ID del estudiante debe ser un número'),
    (0, express_validator_1.check)('curso_id')
        .notEmpty().withMessage('El ID del curso es obligatorio')
        .isNumeric().withMessage('El ID del curso debe ser un número'),
    (0, express_validator_1.check)('nota')
        .optional() // Nota puede ser opcional si no es necesario en el momento de la inscripción
        .isNumeric().withMessage('La nota debe ser un número')
        .isFloat({ min: 0, max: 10 }).withMessage('La nota debe estar entre 0 y 10'),
    (0, express_validator_1.check)('fecha')
        .optional() // La fecha puede ser opcional ya que se establece por defecto
        .isDate().withMessage('La fecha debe ser una fecha válida'),
    // Middleware para manejar errores de validación
    (req, res, next) => {
        const errores = (0, express_validator_1.validationResult)(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ errores: errores.array() });
        }
        next();
    }
];
exports.validar = validar;
const insertar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { estudiante_id, curso_id, fecha } = req.body;
    try {
        const estudiante = yield conexion_1.AppDataSource.getRepository(EstudianteModel_1.Estudiante).findOne({ where: { id: estudiante_id } });
        const curso = yield conexion_1.AppDataSource.getRepository(CursoModel_1.Curso).findOne({ where: { id: curso_id } });
        if (!estudiante || !curso) {
            res.status(400).json({ mensaje: 'Estudiante o curso no encontrado.' });
            return;
        }
        const inscripcion = new CursoEstudianteModel_1.CursoEstudiante();
        inscripcion.estudiante = estudiante;
        inscripcion.curso = curso;
        inscripcion.fecha = fecha || new Date(); // Usa la fecha actual si no se proporciona
        yield conexion_1.AppDataSource.getRepository(CursoEstudianteModel_1.CursoEstudiante).save(inscripcion);
        res.redirect('/inscripciones/listarInscripciones');
    }
    catch (err) {
        console.error('Error al inscribir al estudiante:', err);
        res.status(500).send('Error al inscribir al estudiante');
    }
});
exports.insertar = insertar;
const eliminar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const inscripcionRepository = transactionalEntityManager.getRepository(CursoEstudianteModel_1.CursoEstudiante);
            const resultado = yield inscripcionRepository.delete({ curso_id: parseInt(req.params.curso_id), estudiante_id: parseInt(req.params.estudiante_id) });
            if (resultado.affected == 1) {
                return res.json({ mensaje: 'Inscripción eliminada' });
            }
            else {
                return res.json({ mensaje: 'No se ha podido eliminar la inscripción ' });
            }
        }));
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.eliminar = eliminar;
const consultarTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cursoEstudianteRepository = conexion_1.AppDataSource.getRepository(CursoEstudianteModel_1.CursoEstudiante);
        const estudiantesRepository = conexion_1.AppDataSource.getRepository(EstudianteModel_1.Estudiante);
        const cursosRepository = conexion_1.AppDataSource.getRepository(CursoModel_1.Curso);
        const inscripciones = (yield cursoEstudianteRepository.find({ relations: ['estudiante', 'curso'] })) || [];
        const estudiantes = (yield estudiantesRepository.find()) || [];
        const cursos = (yield cursosRepository.find()) || [];
        res.render('listarInscripciones', {
            pagina: 'Lista de Inscripciones',
            inscripciones,
            estudiantes,
            cursos
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.consultarTodos = consultarTodos;
const modificar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { curso_id, estudiante_id } = req.params;
    try {
        const inscripcionRepository = conexion_1.AppDataSource.getRepository(CursoEstudianteModel_1.CursoEstudiante);
        // Buscar la inscripción específica
        const inscripcion = yield inscripcionRepository.findOne({
            where: {
                curso: { id: parseInt(curso_id) },
                estudiante: { id: parseInt(estudiante_id) }
            },
            relations: ['curso', 'estudiante']
        });
        if (!inscripcion) {
            res.status(404).json({ mensaje: 'Inscripción no encontrada.' });
            return;
        }
        // Renderizar la vista para modificar la inscripción
        res.render('modificarInscripcion', {
            pagina: 'Modificar Inscripción',
            inscripcion
        });
    }
    catch (error) {
        console.error('Error al obtener la inscripción:', error);
        res.status(500).send('Error al obtener la inscripción.');
    }
});
exports.modificar = modificar;
const actualizar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { curso_id, estudiante_id } = req.params;
    const { nota, fecha } = req.body;
    try {
        const inscripcionRepository = conexion_1.AppDataSource.getRepository(CursoEstudianteModel_1.CursoEstudiante);
        // Buscar la inscripción específica
        const inscripcion = yield inscripcionRepository.findOne({
            where: {
                curso: { id: parseInt(curso_id) },
                estudiante: { id: parseInt(estudiante_id) }
            },
            relations: ['curso', 'estudiante']
        });
        if (!inscripcion) {
            res.status(404).json({ mensaje: 'Inscripción no encontrada.' });
            return;
        }
        // Actualizar la nota y la fecha
        inscripcion.nota = nota || inscripcion.nota;
        inscripcion.fecha = fecha || inscripcion.fecha;
        // Guardar los cambios
        yield inscripcionRepository.save(inscripcion);
        res.redirect('/inscripciones/listarInscripciones');
    }
    catch (error) {
        console.error('Error al actualizar la inscripción:', error);
        res.status(500).send('Error al actualizar la inscripción.');
    }
});
exports.actualizar = actualizar;
const buscarEstudiantesPorCurso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { curso_id } = req.params;
    try {
        const cursoEstudianteRepository = conexion_1.AppDataSource.getRepository(CursoEstudianteModel_1.CursoEstudiante);
        const estudiantesEnCurso = yield cursoEstudianteRepository.find({
            where: { curso_id: Number(curso_id) },
            relations: ['estudiante']
        });
        res.json(estudiantesEnCurso);
    }
    catch (error) {
        console.error('Error al obtener estudiantes en el curso:', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
});
exports.buscarEstudiantesPorCurso = buscarEstudiantesPorCurso;
const buscarCursosPorEstudiante = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { estudiante_id } = req.params;
    try {
        const cursoEstudianteRepository = conexion_1.AppDataSource.getRepository(CursoEstudianteModel_1.CursoEstudiante);
        const cursosDelEstudiante = yield cursoEstudianteRepository.find({
            where: { estudiante_id: Number(estudiante_id) },
            relations: ['curso']
        });
        res.json(cursosDelEstudiante);
    }
    catch (error) {
        console.error('Error al obtener cursos del estudiante:', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
});
exports.buscarCursosPorEstudiante = buscarCursosPorEstudiante;
