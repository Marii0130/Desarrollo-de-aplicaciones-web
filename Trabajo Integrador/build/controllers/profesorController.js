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
exports.eliminar = exports.modificar = exports.insertar = exports.consultarUno = exports.consultarTodos = void 0;
const conexion_1 = require("../db/conexion");
const ProfesorModel_1 = require("../models/ProfesorModel");
const profesorRepository = conexion_1.AppDataSource.getRepository(ProfesorModel_1.Profesor);
const consultarTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesores = yield profesorRepository.find();
        res.json(profesores);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.consultarTodos = consultarTodos;
const consultarUno = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesor = yield profesorRepository.findOneBy({ id: parseInt(req.params.id) });
        res.json(profesor);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.consultarUno = consultarUno;
const insertar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesor = profesorRepository.create(req.body);
        const result = yield profesorRepository.save(profesor);
        res.json(result);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.insertar = insertar;
const modificar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesor = yield profesorRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!profesor)
            return res.status(400).json({ mens: "Profesor no encontrado" });
        profesorRepository.merge(profesor, req.body);
        const result = yield profesorRepository.save(profesor);
        res.json(result);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.modificar = modificar;
const eliminar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield profesorRepository.delete(req.params.id);
        res.json(result);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.eliminar = eliminar;
