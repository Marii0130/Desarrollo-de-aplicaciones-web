import app from "./app";
import { initializeDatabase } from './db/conexion';
import * as dotenv from 'dotenv';
dotenv.config();
const port = parseInt(process.env.PORT || '4101', 10);
const host = process.env.HOST || '0.0.0.0';

async function main(){
	try{
		await initializeDatabase();
		console.log('Base de datos conectada');
	} catch (err: unknown){
		if(err instanceof Error){
			console.log('Error al conectar con la base de datos', err.message);
		}
	}
	try {
        app.listen(port, host, () => {
            console.log(`Servidor activo en puerto ${port}`);
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('Error al iniciar el servidor:', err.message);
        }
    }
}

main();