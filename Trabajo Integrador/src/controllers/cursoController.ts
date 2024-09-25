import { Request, Response } from 'express';

export const consultarTodos = async (req:Request, res:Response) =>{
	try{
		res.json('Consulta curso');
	} catch (err: unknown) {
		if (err instanceof Error){
			res.status(500).send(err.message);
		}
	}
}

export const consultarUno = async (req:Request, res:Response) =>{
	try{
		res.json('Consulta un curso');
	} catch (err: unknown) {
		if (err instanceof Error){
			res.status(500).send(err.message);
		}
	}
}

export const insertar = async (req:Request, res:Response) =>{
	try{
		res.json('inserta curso');
	} catch (err: unknown) {
		if (err instanceof Error){
			res.status(500).send(err.message);
		}
	}
}

export const modificar = async (req:Request, res:Response) =>{
	try{
		res.json('modifica curso');
	} catch (err: unknown) {
		if (err instanceof Error){
			res.status(500).send(err.message);
		}
	}
}

export const eliminar = async (req:Request, res:Response) =>{
	try{
		res.json('elimina curso');
	} catch (err: unknown) {
		if (err instanceof Error){
			res.status(500).send(err.message);
		}
	}
}