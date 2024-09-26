import { Request, Response } from 'express';
import { AppDataSource } from '../db/conexion';
import {Curso} from '../models/CursoModel';

const cursoRepository = AppDataSource.getRepository(Curso);

export const consultarTodos = async (req:Request, res:Response) =>{
	try{
		const cursos = await cursoRepository.find();
		res.json(cursos);;
	} catch (err: unknown) {
		if (err instanceof Error){
			res.status(500).send(err.message);
		}
	}
}

export const consultarUno = async (req:Request, res:Response) =>{
	try{
		const curso = await cursoRepository.findOneBy({id: parseInt(req.params.id)});
		res.json(curso);
	} catch (err: unknown) {
		if (err instanceof Error){
			res.status(500).send(err.message);
		}
	}
}

export const insertar = async (req:Request, res:Response) =>{
	try{
		const curso = cursoRepository.create(req.body);
		const result = await cursoRepository.save(curso); 
		res.json(result);
	} catch (err: unknown) {
		if (err instanceof Error){
			res.status(500).send(err.message);
		}
	}
}

export const modificar = async (req:Request, res:Response) =>{
	try{
		const curso = await cursoRepository.findOneBy({id: parseInt(req.params.id)});
		if(!curso)
			return res.status(400).json({mens:"Estudiante no encontrado"});
		cursoRepository.merge(curso, req.body);
		const result=await cursoRepository.save(curso); 
		res.json(result);
	} catch (err: unknown) {
		if (err instanceof Error){
			res.status(500).send(err.message);
		}
	}
}

export const eliminar = async (req:Request, res:Response) =>{
	try{
		const result = await cursoRepository.delete(req.params.id);
		res.json(result);
	} catch (err: unknown) {
		if (err instanceof Error){
			res.status(500).send(err.message);
		}
	}
}