"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
function main() {
    console.log('Iniciando el servidor...');
    app_1.default.listen(4100, () => {
        console.log(`Servidor activo en puerto ${4100}`);
    });
}
main();
