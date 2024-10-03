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
exports.eliminar = exports.modificar = exports.consultarUno = exports.consultarTodos = exports.insertar = exports.validar = void 0;
const express_validator_1 = require("express-validator");
const conexion_1 = require("../db/conexion");
const ProfesorModel_1 = require("../models/ProfesorModel");
const CursoModel_1 = require("../models/CursoModel");
let profesores;
const validar = () => [
    (0, express_validator_1.check)('dni')
        .notEmpty().withMessage('El DNI es obligatorio')
        .isLength({ min: 7 }).withMessage('El DNI debe tener al menos 7 caracteres'),
    (0, express_validator_1.check)('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 3 }).withMessage('El Nombre debe tener al menos 3 caracteres'),
    (0, express_validator_1.check)('apellido')
        .notEmpty().withMessage('El apellido es obligatorio')
        .isLength({ min: 3 }).withMessage('El Apellido debe tener al menos 3 caracteres'),
    (0, express_validator_1.check)('email')
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Debe proporcionar un email válido'),
    (0, express_validator_1.check)('profesion')
        .notEmpty().withMessage('La profesión es obligatoria')
        .isLength({ min: 3 }).withMessage('La profesión debe tener al menos 3 caracteres'),
    (0, express_validator_1.check)('telefono')
        .notEmpty().withMessage('El teléfono es obligatorio')
        .isLength({ min: 10 }).withMessage('El teléfono debe tener al menos 10 caracteres'),
];
exports.validar = validar;
const insertar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errores = (0, express_validator_1.validationResult)(req);
    if (!errores.isEmpty()) {
        return res.render('crearProfesor', {
            pagina: 'Crear Profesor',
            errores: errores.array(),
        });
    }
    const { dni, nombre, apellido, email, profesion, telefono } = req.body;
    try {
        // Verificar si ya existe un profesor con el mismo DNI o email
        const profesorRepository = conexion_1.AppDataSource.getRepository(ProfesorModel_1.Profesor);
        const existeProfesor = yield profesorRepository.findOne({
            where: [
                { dni },
                { email }
            ]
        });
        if (existeProfesor) {
            return res.render('crearProfesor', {
                pagina: 'Crear Profesor',
                errores: [{ msg: 'El DNI o el email ya están registrados en el sistema' }], // Mensaje de error personalizado
            });
        }
        // Crear nuevo profesor si el DNI y email no están duplicados
        const nuevoProfesor = profesorRepository.create({ dni, nombre, apellido, email, profesion, telefono });
        yield profesorRepository.save(nuevoProfesor);
        const profesores = yield profesorRepository.find();
        res.render('listarProfesores', {
            pagina: 'Lista de Profesores',
            profesores,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.insertar = insertar;
const consultarTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesorRepository = conexion_1.AppDataSource.getRepository(ProfesorModel_1.Profesor);
        const profesores = yield profesorRepository.find();
        res.render('listarProfesores', {
            pagina: 'Lista de Profesores',
            profesores
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
        const profesorRepository = conexion_1.AppDataSource.getRepository(ProfesorModel_1.Profesor);
        const profesor = yield profesorRepository.findOne({ where: { id: idNumber } });
        if (profesor) {
            return profesor;
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
const modificar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { dni, nombre, apellido, email, profesion, telefono } = req.body;
    try {
        const profesorRepository = conexion_1.AppDataSource.getRepository(ProfesorModel_1.Profesor);
        const profesor = yield profesorRepository.findOne({ where: { id: parseInt(id) } });
        if (!profesor) {
            return res.status(404).send('Profesor no encontrado');
        }
        profesorRepository.merge(profesor, { dni, nombre, apellido, email, profesion, telefono });
        yield profesorRepository.save(profesor);
        return res.redirect('/profesores/listarProfesores');
    }
    catch (error) {
        console.error('Error al modificar el profesor:', error);
        res.status(500).send('Error del servidor');
    }
});
exports.modificar = modificar;
const eliminar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        //console.log(`ID recibido para eliminar: ${id}`); 
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const cursoRepository = transactionalEntityManager.getRepository(CursoModel_1.Curso);
            const profesorRepository = transactionalEntityManager.getRepository(ProfesorModel_1.Profesor);
            const cursosRelacionados = yield cursoRepository.count({ where: { profesor: { id: Number(id) } } });
            if (cursosRelacionados > 0) {
                throw new Error('Profesor dictando materias, no se puede eliminar');
            }
            const deleteResult = yield profesorRepository.delete(id);
            if (deleteResult.affected === 1) {
                return res.json({ mensaje: 'Profesor eliminado' });
            }
            else {
                throw new Error('Profesor no encontrado');
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
