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
exports.eliminar = exports.modificar = exports.mostrarFormularioCrear = exports.consultarUno = exports.consultarTodos = exports.insertar = void 0;
const express_validator_1 = require("express-validator");
const conexion_1 = require("../db/conexion");
const CursoModel_1 = require("../models/CursoModel");
const ProfesorModel_1 = require("../models/ProfesorModel");
const CursoEstudianteModel_1 = require("../models/CursoEstudianteModel");
/*export const validar = () => [
    check('nombre')
        .notEmpty().withMessage('El nombre es un campo obligatorio')
        .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),

    check('descripcion')
        .notEmpty().withMessage('La descripción es un campo obligatorio')
        .isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres'),

    check('profesor_id')
        .notEmpty().withMessage('El ID del profesor es un campo obligatorio')
        .isNumeric().withMessage('El ID del profesor debe ser un número'),

    // Middleware para manejar errores de validación
    (req: Request, res: Response, next: NextFunction) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.render('crearCurso', {
                pagina: 'Crear Curso',
                errores: errores.array()
            });
        }
        next();
    }
];
*/
const insertar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errores = (0, express_validator_1.validationResult)(req);
    if (!errores.isEmpty()) {
        res.status(400).json({ errores: errores.array() });
        return; // Asegúrate de salir de la función después de enviar la respuesta
    }
    const { nombre, descripcion, profesor_id } = req.body;
    try {
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const cursoRepository = transactionalEntityManager.getRepository(CursoModel_1.Curso);
            const profesorRepository = transactionalEntityManager.getRepository(ProfesorModel_1.Profesor);
            const profesor = yield profesorRepository.findOneBy({ id: profesor_id });
            if (!profesor) {
                throw new Error('El profesor especificado no existe.');
            }
            const existeCurso = yield cursoRepository.findOne({
                where: { nombre }
            });
            if (existeCurso) {
                throw new Error('El curso ya existe.');
            }
            const nuevoCurso = cursoRepository.create({ nombre, descripcion, profesor });
            yield cursoRepository.save(nuevoCurso);
        }));
        res.redirect('/cursos/listarCursos');
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ mensaje: err.message });
        }
        else {
            res.status(500).json({ mensaje: 'Error desconocido' });
        }
    }
});
exports.insertar = insertar;
const consultarTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cursoRepository = conexion_1.AppDataSource.getRepository(CursoModel_1.Curso);
        // Incluir la relación con 'profesor'
        const cursos = yield cursoRepository.find({ relations: ['profesor'] });
        res.render('listarCursos', {
            pagina: 'Lista de Cursos',
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
const consultarUno = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
        throw new Error('ID inválido, debe ser un número');
    }
    try {
        const cursoRepository = conexion_1.AppDataSource.getRepository(CursoModel_1.Curso);
        const curso = yield cursoRepository.findOne({ where: { id: idNumber } });
        if (curso) {
            return curso;
        }
        else {
            return null;
        }
    }
    catch (err) {
        if (err instanceof Error) {
            throw err;
        }
        else {
            throw new Error('Error desconocido');
        }
    }
});
exports.consultarUno = consultarUno;
const mostrarFormularioCrear = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesorRepository = conexion_1.AppDataSource.getRepository(ProfesorModel_1.Profesor);
        const profesores = yield profesorRepository.find(); // Obtén todos los profesores
        res.render('crearCurso', {
            pagina: 'Crear Curso',
            profesores // Pasas los profesores a la vista
        });
    }
    catch (error) {
        console.error('Error al obtener los profesores:', error);
        res.status(500).send('Error al cargar el formulario');
    }
});
exports.mostrarFormularioCrear = mostrarFormularioCrear;
const modificar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nombre, descripcion, profesor_id } = req.body;
    try {
        const cursoRepository = conexion_1.AppDataSource.getRepository(CursoModel_1.Curso);
        const profesorRepository = conexion_1.AppDataSource.getRepository(ProfesorModel_1.Profesor);
        const curso = yield cursoRepository.findOne({ where: { id: parseInt(id) }, relations: ['profesor'] });
        if (!curso) {
            return res.status(404).send('Curso no encontrado');
        }
        const profesor = yield profesorRepository.findOneBy({ id: profesor_id });
        if (!profesor) {
            throw new Error('Debe seleccionar un profesor válido.');
        }
        curso.nombre = nombre;
        curso.descripcion = descripcion;
        curso.profesor = profesor;
        yield cursoRepository.save(curso);
        res.redirect('/cursos/listarCursos');
    }
    catch (error) {
        console.error('Error al modificar el curso:', error);
        res.status(500).send('Error al modificar el curso');
    }
});
exports.modificar = modificar;
const eliminar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const inscripcionRepository = transactionalEntityManager.getRepository(CursoEstudianteModel_1.CursoEstudiante);
            const estudianteRepository = transactionalEntityManager.getRepository(CursoModel_1.Curso);
            const cursosRelacionados = yield inscripcionRepository.count({ where: { curso: { id: Number(id) } } });
            if (cursosRelacionados > 0) {
                throw new Error('Curso asociado a estudiantes, no se puede eliminar');
            }
            const deleteResult = yield estudianteRepository.delete(id);
            if (deleteResult.affected === 1) {
                return res.json({ mensaje: 'Curso eliminado' });
            }
            else {
                throw new Error('Curso no encontrado');
            }
        }));
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ mensaje: err.message });
        }
        else {
            res.status(400).json({ mensaje: 'Error' });
        }
    }
});
exports.eliminar = eliminar;
