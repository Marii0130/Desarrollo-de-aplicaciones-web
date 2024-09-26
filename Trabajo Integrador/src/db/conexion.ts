import { createConnection } from 'mysql2/promise';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const port:number = process.env.BD_PORT ? parseInt(process.env.BD_PORT, 10):3306;

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
	entities:[],
	synchronize:true,
	logging:true
});

export async function initializeDatabase(){
	await createDatabaseIfNotExists();
	await AppDataSource.initialize();
}