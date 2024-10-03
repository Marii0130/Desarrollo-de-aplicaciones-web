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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inscripcionController_1 = require("../controllers/inscripcionController");
const conexion_1 = require("../db/conexion"); // Asegúrate de ajustar la importación
const EstudianteModel_1 = require("../models/EstudianteModel"); // Asegúrate de ajustar la importación
const CursoModel_1 = require("../models/CursoModel"); // Asegúrate de ajustar la importación
const router = express_1.default.Router();
router.get('/listarEstudiantesPorCurso/:curso_id', inscripcionController_1.buscarEstudiantesPorCurso);
// Listar cursos por estudiante
router.get('/listarCursosPorEstudiante/:estudiante_id', inscripcionController_1.buscarCursosPorEstudiante);
// Ruta para crear inscripciones
router.get('/crearInscripcion', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estudiantes = yield conexion_1.AppDataSource.getRepository(EstudianteModel_1.Estudiante).find(); // Obtener la lista de estudiantes
        const cursos = yield conexion_1.AppDataSource.getRepository(CursoModel_1.Curso).find(); // Obtener la lista de cursos
        res.render('crearInscripcion', {
            pagina: 'Crear Inscripción',
            estudiantes, // Pasar estudiantes a la vista
            cursos // Pasar cursos a la vista
        });
    }
    catch (error) {
        console.error('Error al obtener estudiantes o cursos:', error);
        res.status(500).send('Error al cargar la página de creación de inscripciones');
    }
}));
router.get('/listarInscripciones', inscripcionController_1.consultarTodos);
router.post('/crearInscripcion', (0, inscripcionController_1.validar)(), inscripcionController_1.insertar);
router.delete('/:curso_id/:estudiante_id', inscripcionController_1.eliminar);
router.get('/modificarInscripcion/:curso_id/:estudiante_id', inscripcionController_1.modificar);
router.put('/:curso_id/:estudiante_id', (0, inscripcionController_1.validar)(), inscripcionController_1.actualizar);
exports.default = router;
