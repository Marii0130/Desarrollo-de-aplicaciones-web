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
exports.calificar = exports.cancelarInscripcion = exports.inscribir = exports.consultarxCurso = exports.consultarxAlumno = exports.consultarInscripciones = void 0;
const conexion_1 = require("../db/conexion");
const CursoEstudianteModel_1 = require("../models/CursoEstudianteModel");
const inscripcionRepository = conexion_1.AppDataSource.getRepository(CursoEstudianteModel_1.CursoEstudiante);
const consultarInscripciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inscripciones = yield inscripcionRepository.find();
        res.json(inscripciones);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.consultarInscripciones = consultarInscripciones;
const consultarxAlumno = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json('Consulta un alumno');
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.consultarxAlumno = consultarxAlumno;
const consultarxCurso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json('Consultar por curso');
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.consultarxCurso = consultarxCurso;
const inscribir = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inscripcion = inscripcionRepository.create(req.body);
        const result = yield inscripcionRepository.save(inscripcion);
        res.json(result);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.inscribir = inscribir;
const cancelarInscripcion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield inscripcionRepository.delete(req.params.id);
        res.json(result);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.cancelarInscripcion = cancelarInscripcion;
const calificar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json('Calificar');
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.calificar = calificar;
