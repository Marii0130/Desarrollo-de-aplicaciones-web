import { Request, Response } from 'express';

export const consultarTodos = async (req:Request, res:Response) =>{
	try{
		res.json('Consulta estud');
	} catch (err: unknown) {
		if (err instanceof Error){
			res.status(500).send(err.message);
		}
	}
}

export const consultarUno = async (req:Request, res:Response) =>{
	try{
		res.json('Consulta un estud');
	} catch (err: unknown) {
		if (err instanceof Error){
			res.status(500).send(err.message);
		}
	}
}

export const insertar = async (req:Request, res:Response) =>{
	try{
		res.json('inserta estud');
	} catch (err: unknown) {
		if (err instanceof Error){
			res.status(500).send(err.message);
		}
	}
}

export const modificar = async (req:Request, res:Response) =>{
	try{
		res.json('modifica estud');
	} catch (err: unknown) {
		if (err instanceof Error){
			res.status(500).send(err.message);
		}
	}
}

export const eliminar = async (req:Request, res:Response) =>{
	try{
		res.json('elimina estud');
	} catch (err: unknown) {
		if (err instanceof Error){
			res.status(500).send(err.message);
		}
	}
}