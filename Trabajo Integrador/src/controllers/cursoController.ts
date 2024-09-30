import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import { AppDataSource } from '../db/conexion';
import {Curso} from '../models/CursoModel';
import {Profesor} from '../models/ProfesorModel';
import {CursoEstudiante} from '../models/CursoEstudianteModel';

export const validar = () => [
    check('nombre')
        .notEmpty().withMessage('El nombre es un campo obligatorio')
        .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),

    check('descripcion')
        .notEmpty().withMessage('La descripción es un campo obligatorio')
        .isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres'),

    check('profesor_id')
        .notEmpty().withMessage('El ID del profesor es un campo obligatorio')
        .isNumeric().withMessage('El ID del profesor debe ser un número'),

    (req: Request, res: Response, next: NextFunction) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.render('crearCurso', {
                pagina: 'Crear Curso',
                errores: errores.array()
            });
        }
        next();
    }
];

export const consultarTodos = async (req: Request, res: Response) => {
    try {
        const cursoRepository = AppDataSource.getRepository(Curso);
        
        // Incluir la relación con 'profesor'
        const cursos = await cursoRepository.find({ relations: ['profesor'] });
        
        res.render('listarCursos', {
            pagina: 'Lista de Cursos',
            cursos 
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
};

export const consultarUno = async (req:Request, res:Response) : Promise<Curso | null> =>{
	const { id } = req.params;
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
        throw new Error('ID inválido, debe ser un número');
    }
	try{
		const cursoRepository = AppDataSource.getRepository(Curso);
		const curso = await cursoRepository.findOne({ where: { id: idNumber } });

        if (curso) {
            return curso;
        } else {     

            return null; 
        }
	} catch (err: unknown) {
		if (err instanceof Error) {
            throw err; 
        } else {
            throw new Error('Error desconocido');
        }
	}
};

export const mostrarFormularioCrear = async (req: Request, res: Response) => {
    try {
        const profesorRepository = AppDataSource.getRepository(Profesor);
        const profesores = await profesorRepository.find(); // Obtén todos los profesores

        res.render('crearCurso', {
            pagina: 'Crear Curso',
            profesores // Pasas los profesores a la vista
        });
    } catch (error) {
        console.error('Error al obtener los profesores:', error);
        res.status(500).send('Error al cargar el formulario');
    }
};

export const insertar = async (req: Request, res: Response): Promise<void> => {
	const errores = validationResult(req);
	if (!errores.isEmpty()) {
	   res.status(400).json({ errores: errores.array() });
	}
	
	const { nombre, descripcion, profesor_id } = req.body;
	try {
	  await AppDataSource.transaction(async (transactionalEntityManager) => {
		const cursoRepository = transactionalEntityManager.getRepository(Curso);
		const profesorRepository = transactionalEntityManager.getRepository(Profesor);
		const profesor = await profesorRepository.findOneBy({ id: profesor_id });
        const profesores = await profesorRepository.find();
		if (!profesor) {
		  throw new Error('El profesor especificado no existe.');
		}
  
		const existeCurso = await cursoRepository.findOne({
		  where: { nombre }
		});
  
		if (existeCurso) {
		  throw new Error('El curso ya existe.');
		}
  
		const nuevoCurso = cursoRepository.create({ nombre, descripcion, profesor });
		await cursoRepository.save(nuevoCurso);
	  });
  
	  res.redirect('/cursos/listarCursos');
	} catch (err: unknown) {
	  if (err instanceof Error) {
		res.status(500).json({ mensaje: err.message });
	  } else {
		res.status(500).json({ mensaje: 'Error desconocido' });
	  }
	}
  };

  export const modificar = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nombre, descripcion, profesor_id } = req.body;

    try {
        const cursoRepository = AppDataSource.getRepository(Curso);
        const profesorRepository = AppDataSource.getRepository(Profesor);

        const curso = await cursoRepository.findOne({ where: { id: parseInt(id) }, relations: ['profesor'] });
        if (!curso) {
            return res.status(404).send('Curso no encontrado');
        }

        const profesor = await profesorRepository.findOneBy({ id: profesor_id });
        if (!profesor) {
            throw new Error('Debe seleccionar un profesor válido.');
        }

        curso.nombre = nombre;
        curso.descripcion = descripcion;
        curso.profesor = profesor;

        await cursoRepository.save(curso);

        res.redirect('/cursos/listarCursos');
    } catch (error) {
        console.error('Error al modificar el curso:', error);
        res.status(500).send('Error al modificar el curso');
    }
};

  export const eliminar = async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params;
	try {

		await AppDataSource.transaction(async transactionalEntityManager => {
			const inscripcionRepository = transactionalEntityManager.getRepository(CursoEstudiante);
			const estudianteRepository = transactionalEntityManager.getRepository(Curso);

			const cursosRelacionados = await inscripcionRepository.count({ where: { curso: { id: Number(id) } } });
			if (cursosRelacionados > 0) {
				throw new Error('Curso asociado a estudiantes, no se puede eliminar');
			}
			const deleteResult = await estudianteRepository.delete(id);

			if (deleteResult.affected === 1) {
				return res.json({ mensaje: 'Curso eliminado' }); 
			} else {
				throw new Error('Curso no encontrado');
			}
		});
	} catch (err: unknown) {
		if (err instanceof Error) {
			res.status(400).json({ mensaje: err.message });
		} else {
			res.status(400).json({ mensaje: 'Error' });
		}
	}
};