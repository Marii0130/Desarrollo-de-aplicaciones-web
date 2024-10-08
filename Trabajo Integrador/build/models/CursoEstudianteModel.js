"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursoEstudiante = void 0;
const typeorm_1 = require("typeorm");
const CursoModel_1 = require("./CursoModel");
const EstudianteModel_1 = require("./EstudianteModel");
let CursoEstudiante = class CursoEstudiante {
};
exports.CursoEstudiante = CursoEstudiante;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], CursoEstudiante.prototype, "estudiante_id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], CursoEstudiante.prototype, "curso_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CursoEstudiante.prototype, "nota", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: Date, default: () => 'CURRENT_DATE' }),
    __metadata("design:type", Date)
], CursoEstudiante.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => EstudianteModel_1.Estudiante, (estudiante) => estudiante.cursos),
    (0, typeorm_1.JoinColumn)({ name: 'estudiante_id' }),
    __metadata("design:type", EstudianteModel_1.Estudiante)
], CursoEstudiante.prototype, "estudiante", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => CursoModel_1.Curso, (curso) => curso.estudiantes),
    (0, typeorm_1.JoinColumn)({ name: 'curso_id' }),
    __metadata("design:type", CursoModel_1.Curso)
], CursoEstudiante.prototype, "curso", void 0);
exports.CursoEstudiante = CursoEstudiante = __decorate([
    (0, typeorm_1.Entity)('curso_estudiantes')
], CursoEstudiante);
