import { Request, Response } from 'express';
import { AppDataSource } from '../bd/conexion';
import {Profesor} from '../models/ProfesorModel';

const profesorRepository = AppDataSource.getRepository(Profesor);

export const consultarTodos = async (req:Request, res:Response) =>{
	try{
		const profesores = await profesorRepository.find();
		res.json(profesores);
	} catch (err: unknown) {
		if (err instanceof Error){
			res.status(500).send(err.message);
		}
	}
}

export const consultarUno = async (req:Request, res:Response) =>{
	try{
		const profesor = await profesorRepository.findOneBy({id: parseInt(req.params.id)});
		res.json(profesor);
	} catch (err: unknown) {
		if (err instanceof Error){
			res.status(500).send(err.message);
		}
	}
}

export const insertar = async (req:Request, res:Response) =>{
	try{
		const profesor = profesorRepository.create(req.body);
		const result = await profesorRepository.save(profesor); 
		res.json(result);
	} catch (err: unknown) {
		if (err instanceof Error){
			res.status(500).send(err.message);
		}
	}
}

export const modificar = async (req:Request, res:Response) =>{
	try{
		const profesor = await profesorRepository.findOneBy({id: parseInt(req.params.id)});
		if(!profesor)
			return res.status(400).json({mens:"Profesor no encontrado"});
		profesorRepository.merge(profesor, req.body);
		const result=await profesorRepository.save(profesor); 
		res.json(result);
	} catch (err: unknown) {
		if (err instanceof Error){
			res.status(500).send(err.message);
		}
	}
}

export const eliminar = async (req:Request, res:Response) =>{
	try{
		const result = await profesorRepository.delete(req.params.id);
		res.json(result);
	} catch (err: unknown) {
		if (err instanceof Error){
			res.status(500).send(err.message);
		}
	}
}