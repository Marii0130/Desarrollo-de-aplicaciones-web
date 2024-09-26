import { Request, Response } from 'express';
import { AppDataSource } from '../bd/conexion';
import {CursoEstudiante} from '../models/CursoEstudianteModel';

const inscripcionRepository = AppDataSource.getRepository(CursoEstudiante);

export const consultarInscripciones = async (req:Request, res:Response) =>{
	try{
		const inscripciones = await inscripcionRepository.find();
		res.json(inscripciones);
	} catch (err: unknown) {
		if (err instanceof Error){
			res.status(500).send(err.message);
		}
	}
}

export const consultarxAlumno = async (req:Request, res:Response) =>{
	try{
		res.json('Consulta un alumno');
	} catch (err: unknown) {
		if (err instanceof Error){
			res.status(500).send(err.message);
		}
	}
}

export const consultarxCurso = async (req:Request, res:Response) =>{
	try{
		res.json('Consultar por curso');
	} catch (err: unknown) {
		if (err instanceof Error){
			res.status(500).send(err.message);
		}
	}
}

export const inscribir = async (req:Request, res:Response) =>{
	try{
		const inscripcion = inscripcionRepository.create(req.body);
		const result = await inscripcionRepository.save(inscripcion); 
		res.json(result);
	} catch (err: unknown) {
		if (err instanceof Error){
			res.status(500).send(err.message);
		}
	}
}

export const cancelarInscripcion = async (req:Request, res:Response) =>{
	try{
		const result = await inscripcionRepository.delete(req.params.id);
		res.json(result);
	} catch (err: unknown) {
		if (err instanceof Error){
			res.status(500).send(err.message);
		}
	}
}

export const calificar = async (req:Request, res:Response) =>{
	try{
		res.json('Calificar');
	} catch (err: unknown) {
		if (err instanceof Error){
			res.status(500).send(err.message);
		}
	}
}