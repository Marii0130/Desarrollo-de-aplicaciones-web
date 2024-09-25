"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//import { profesorController } from '../controllers/profesorController';
const profesorController_1 = require("../controllers/profesorController");
router.get('/', profesorController_1.consultarTodos);
router.post('/', profesorController_1.insertar);
router.route('/:id')
    .get(profesorController_1.consultarUno)
    .put(profesorController_1.modificar)
    .delete(profesorController_1.eliminar);
exports.default = router;
