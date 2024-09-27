import { createConnection } from 'mysql2/promise';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Profesor } from '../models/ProfesorModel';
import { Estudiante } from '../models/EstudianteModel';
import { CursoEstudiante } from '../models/CursoEstudianteModel';
import { Curso } from '../models/CursoModel';
dotenv.config();

/*console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);*/

const port:number = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10):3306;

async function createDatabaseIfNotExists() {
	const connection=await createConnection({
			host: process.env.DB_HOST,
			port,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD
		}
	);
	await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
	connection.end();
}

export const AppDataSource=new DataSource({
	type:"mysql",
	host: process.env.DB_HOST,
	port,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	entities:[Estudiante, Profesor, Curso, CursoEstudiante],
	synchronize:true,
	logging:true
});

export async function initializeDatabase(){
	await createDatabaseIfNotExists();
	await AppDataSource.initialize();
}